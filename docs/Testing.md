# Backend Testing
In this phase, our objective is to prepare the backend automated test suite (unit + integration) and ensure the testing pipeline runs correctly.

## Testing Framework: 
- JUnit 5, executed via Maven Surefire.

## Test Location
All backend tests are located under: 
- `src/backend/app/src/test/java/com/swe481/backend`

## Test Structure (Three Levels):

### Level 1: Application Context Test
- `BackendApplicationTests`
Ensures the Spring Boot context loads successfully.

### Level 2: Controller Integration Tests
- `AuthControllerTest`
- `StarControllerIntegrationTesting`
- `MovieControllerIntegrationTesting`
- `MovieControllerIntegrationTest`
- `GenreControllerIntegrationTesting`
- `CheckoutControllerIntegrationTesting`
- `CartControllerIntegrationTesting`
Validate REST endpoints using Spring Test utilities.

### Level 3: Service Unit Tests
- `AuthServiceImplUnitTest`
- `CartServiceImplUnitTest`
- `CheckoutServiceImplUnitTest`
- `GenreServiceImplUnitTest`
- `MovieServiceImplUnitTest`
- `MovieServiceImplUnitTesting`
- `StarServiceImplUnitTest`


## Executing the Tests:
Full suite, run from:  
- `src/backend/app`
Command:
- `./mvnw clean test`

### Sample Test Coverage (Auth Example)
Example test class:
- `AuthControllerTest.java`
Covers authentication endpoint integration scenarios such as Successful login and Invalid credentials handling (expected error behavior), also Covers service-level logic for:
- `login()`
- `logout()`
- `register()`

Run a target subset:
`./mvnw -Dtest="*Auth*Test,*BackendApplicationTests" test`

Console summary sample:
`[ERROR] Tests run: 8, Failures: 1, Errors: 0, Skipped: 0`
`[INFO] BUILD FAILURE`
Note: Failures are acceptable in this phase because the goal is test preparation and ensuring test execution works end-to-end.


# Frontend Testing
Our objective here is to prepare an E2E tests to validate the main user flows.

## Testing Framework: 
- Playwright(E2E).

## Test Location
All frontend E2E tests are located under: 
- `src/frontend/tests/e2e.spec.ts`

## Running the E2E Suite
Run From:
`src/frontend`
Command:
`npx playwright test`

## Covary Summary of what we test:
The E2E suite validates end-to-end behavior across multiple pages:

1) Movie Details Flow
- Loads a movie details page by ID
- Verifies main fields are rendered
- Tests quantity increment & add-to-cart
- Verifies stars list is visible and links format is correct
- Tests back navigation

2) Star Details Flow
- Loads star details by ID
- Verifies star info renders
- Validates movie links exist and navigate correctly

3) Browse Movies
- Browse by first letter/number
- Browse by genre
- Browse all movies + pagination
- Sorting behavior
- Navigation via movie/star/genre links

4) Cart Flow
- Cart page loads
- Load Cart fetch call
- Update/delete items (if any exist)
- Clear cart locally
- Navigation to Movies and Checkout

5) Authentication Flow
- Register with unique email (avoids seed dependency)
- Login using the registered credentials
- Validates success response rendering

Execution Result:
Console output summary:
`Running 39 tests using 8 workers`
`21 passed`
`18 failed`
`Serving HTML report at http://localhost:9323.`
Note: Failures are expected in this phase due to non-stable selectors (test ids), and DB seed/value mismatches. These will be stabilized in the next iteration.
