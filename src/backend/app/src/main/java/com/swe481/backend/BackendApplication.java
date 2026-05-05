package com.swe481.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
@EnableCaching
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	/**
	 * Configures the cache manager for the application.
	 *
	 * Uses Caffeine cache with the following settings:
	 *
	 * - maximumSize(500): Controls the maximum number of entries the cache can
	 *   hold. When the limit is reached, Caffeine uses a TinyLFU (Tiny Least
	 *   Frequently Used) eviction policy to decide which entry to remove.
	 *   Unlike pure LRU which only considers recency, TinyLFU considers both
	 *   how recently and how frequently an entry has been accessed. Entries
	 *   that are accessed more often are more likely to stay in cache. When
	 *   two entries have been accessed an equal number of times, the more
	 *   recently added entry tends to be evicted first.
	 */
	@Bean
	public CacheManager cacheManager() {
		CaffeineCacheManager cacheManager = new CaffeineCacheManager(
			"movieSearch",
			"moviesByGenre",
			"moviesByFirstLetter",
			"movieById",
			"movieTitleSuggestions",
			"genres",
			"starById",
			"starMovies"
		);
		cacheManager.setCaffeine(Caffeine.newBuilder()
			.expireAfterWrite(10, TimeUnit.MINUTES)
			.maximumSize(500) 
		);
		return cacheManager;
	}

}
