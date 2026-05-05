# Performance Enhancements

Performance optimization ensures that the application responds to user requests efficiently. In this project, two performance enhancement techniques were applied: caching and query optimization.

---

## Part 1: Caching

Caching is a performance optimization technique that stores the results of expensive operations so that future requests for the same data can be served faster without repeating the work. In this project, caching was implemented on both the frontend (Angular) and backend (Spring Boot) to reduce unnecessary database queries and backend requests.

---

### Backend Caching (Spring Boot)

The backend cache is shared across **all users connected to the same server**. When any user makes a request, the result is stored on the server. If another user makes the identical request, the server returns the cached result instantly without hitting the database, meaning the database is only queried once for that particular request regardless of how many users ask for it.

Spring Boot's `@Cacheable` annotation was used to implement this. For example, caching movies by genre:

```java
@Cacheable(value = "moviesByGenre", key = "{#genreId, #page, #pageSize}")
public MoviesPageState browseMoviesByGenre(Integer genreId, int page, int pageSize) {
    // hits the database only when result is not already cached
}
```

This was applied to all movie, genre, and star related read operations throughout the backend services. To enable caching, `@EnableCaching` was added to `BackendApplication.java`.

#### Cache Eviction Policy (Caffeine)

By default, Spring Boot's simple cache has no size limit. It grows forever, which could eventually consume all server memory. To address this, the cache was configured using **Caffeine** with a size limit:

**Size Limit: `maximumSize(500)`**
The cache can hold a maximum of 500 entries. When the limit is reached, Caffeine uses a **TinyLFU (Tiny Least Frequently Used)** eviction policy to decide which entry to remove. TinyLFU considers both how recently and how frequently an entry has been accessed. Entries that are accessed more often are more likely to stay in cache. When entries have been accessed an equal number of times, the more recently added entry tends to be evicted first.

---

### Frontend Caching (Angular)

The frontend cache prevents unnecessary backend requests. It lives inside Angular services as in-memory `Map` objects and persists as the user navigates between pages within the same session. However, it starts fresh every time the user opens a new tab, refreshes the page, or closes the browser.

The most impactful example is **genre caching**. Genres are displayed on the home page, and without caching, every time the user navigates back to the home page a new request would be sent to the backend to fetch the same genre list. With caching, genres are fetched only once per session and reused on every subsequent visit:

```typescript
getAllGenres(): Observable<GenreDto[]> {
  if (this.cachedGenres) {
    return of(this.cachedGenres); // return cached, no HTTP call
  }
  return this.http.get<GenreDto[]>(this.apiUrl).pipe(
    tap(genres => this.cachedGenres = genres) // store on first fetch
  );
}
```

The same caching pattern was also applied to movie search results, browsing by genre, browsing by first letter, movie details, and star details to further enhance overall application performance and reduce redundant backend calls.

---

Together, the two caching layers work as follows:

```
User request → Frontend cache (instant, prevents backend request)
                      ↓ not in frontend cache
             → Backend cache (fast, prevents database query, shared across all users)
                      ↓ not in backend cache
             → Database (queried only when necessary)
```

---
However, after further research and reflection on the course material, it was found that the delay introduced by a backend request is generally very small compared to the cost of a database query. The real performance gain comes from the backend cache, not the frontend cache. 
In the case of genres, frontend caching makes clear sense since genres are always present on the home page and never change avoiding a repeated request on every home page visit is a genuine improvement. 
For other data such as movie search results or star details, the frontend cache consumes browser memory without providing a significant performance benefit, since the backend cache already handles the heavy lifting. The frontend caching for those cases was kept for learning, to understand and practice the difference between the two caching layers.

---
## Part 2: Query Optimization
Query optimization ensures that the database queries themselves are as efficient as possible. The goal set for this project was to aim for a response time of under 500ms for important data retrieval operations.

### Measurement Approach
Query execution times were measured using jOOQ's built-in query logger, enabled by adding the following to `application.properties`:

```properties
logging.level.org.jooq.tools.LoggerListener=INFO
```

This logs the execution time of each database query in milliseconds, isolating pure database performance from network and other factors. 
The results are stored in `src/backend/app/logs/query-perfomrance.log`.

To ensure honest and accurate measurements:
- The server was restarted before the measurement to ensure every request hit the database fresh with no cache involved.
- Queries were tested using the **worst case scenarios**: the heaviest possible inputs that return the largest result sets. If the heaviest query meets the 500ms target, all lighter queries automatically meet it too.

### Worst Case Scenarios Tested
The following scenarios were considered the worst cases and were used to validate that response times remain under 500ms:

**Movie Retrieval:**
- Retrieve movies with the maximum page size (100 results per page)
- Retrieve movies with maximum page size sorted by title or rating
- Navigate to a late page number to test the cost of large `OFFSET` values
- Request the last possible page with the smallest page size (10) to maximize offset cost
- Search by a single common character which matches the largest number of results
- Search by a common title word, star name, or director name that returns the largest number of matches

**Movie & Star Details:**
- Movie details page for a movie with the highest number of associated stars
- Star details page for a star with the highest number of associated movies

**Authentication & Registration:**
- Login with incorrect credentials
- Register with an email that already exists
- Register with a credit card that already exists

**Checkout:**
- Checkout with a card that does not exist
- Checkout with a large cart containing multiple items

---

### Optimizations Applied

Several query optimization techniques were applied throughout the backend to ensure response times stay within the 500ms target:

**1. Pagination**
All movie listing operations use `LIMIT` and `OFFSET` to fetch only the requested page of results instead of retrieving all matching records at once. This is the most impactful optimization. Without pagination, fetching all Drama movies for example would retrieve thousands of records in a single query. With pagination, only the requested page is fetched, drastically reducing database load.

**2. Fetch IDs First, Then Details**
In all movie listing operations (`searchMovies`, `browseMoviesByGenre`, `browseMoviesByFirstLetter`), the query is split into two steps. First fetch only the movie IDs that match the condition with pagination applied, then fetch the full details only for those specific IDs. This avoids joining and transferring large amounts of unnecessary data from the database.

**3. EXISTS Subquery for Star Name Search**
When filtering movies by a star name, a basic approach would be to join the entire stars table against all movies, process every star for every movie, and then filter. This means if a movie has 10 stars, all 10 rows are joined and processed before deciding whether the movie qualifies. Instead, an `EXISTS` subquery is used. For each movie, the database checks its associated stars one by one and stops the moment it finds a star whose name matches the search input. The remaining stars for that movie are never checked. This makes the filter significantly more efficient, especially for movies with large numbers of associated stars and datasets with millions of star-movie relationships.

**4. Early Exit on Zero Results**
Before fetching any movie data, the total result count is checked first. If the count is zero, the method returns immediately without executing any further database queries, avoiding unnecessary work.

