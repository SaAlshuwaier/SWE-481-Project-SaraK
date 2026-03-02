# Backend Testing
Our objective is to prepare the backend automated test suite (unit + integration) and ensure the testing pipeline runs correctly.

## Testing Framework: 
### Controller Integration Tests (REST endpoints)
- JUnit 5 (testing framework)
- Spring Boot Test (Spring testing support / context)
- MockMvc (testing Spring MVC controllers & HTTP endpoints)

### Service Unit Tests (business logic)
- JUnit 5 (testing framework)
- Mockito Extension (JUnit 5 integration)

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
- `MovieControllerIntegrationTest`
- `GenreControllerIntegrationTesting`
- `CheckoutControllerIntegrationTesting`
- `CartControllerIntegrationTesting`


### Level 3: Service Unit Tests
- `AuthServiceImplUnitTest`
- `CartServiceImplUnitTest`
- `CheckoutServiceImplUnitTest`
- `GenreServiceImplUnitTest`
- `MovieServiceImplUnitTest`
- `StarServiceImplUnitTest`


## How to Run the Backend Tests
1- Navigate to: `src/backend/app`
2- Install Dependencies (if not already installed): `./mvnw clean install`
3- Run Command: `./mvnw clean test`
- To run a target subset: `./mvnw -Dtest="YourTestClassName" test`

# Frontend Testing
## Testing Framework: 
### TypeScript Component Unit Tests (UI Components)
- Angular Testing Utilities (TestBed, ComponentFixture)
- RxJS (testing Observables, e.g., of(), throwError())
- Vitest mock utilities (vi.fn) for lightweight function mocking
- Executed via Angular CLI unit test builder: @angular/build:unit-test

### TypeScript Service Unit Tests (API / Data Services)
- Angular Testing Utilities (TestBed)
- HttpClientTestingModule 
- HttpTestingController (mocking and verifying HTTP requests)
- Executed via Angular CLI unit test builder: @angular/build:unit-test

## Test Location 
- Service tests: `src/frontend/src/app/core/services`
- Component testt: `src/frontend/src/app/pages`

## How to Run the Frontend Tests
1- Navigate to: `src/frontend`
2- Install Dependencies (if not already installed): `npm install`
3- Run Command: `ng test`

# System Testing
Our objective is to validate full system behavior across components (frontend + backend + database) and evaluate performance and resilience under load and failure conditions.

## End-to-End (E2E) Testing
### Testing Tool
- Playwright (E2E testing framework for full user-flow validation through the UI)

### Test Location
- `src/frontend/tests/e2e.spec.ts`

### How to Run the Frontend Tests
1- Navigate to: `src/frontend`
2- Install Dependencies (if not already installed): `npm install` and `npx playwright install`
3- Run Command: `npx playwright test`

### Covary Summary of what we test:
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

## Stress and Roubstness Testing
**Stress Testing**:
The goal was to simulate high traffic to test how the system performs under heavy load. The test increased the virtual users (VUs) to simulate real-world usage, gradually ramping up to test the system’s maximum capacity. Once the system hits failure thresholds, the test stops early.

**Robustness Testing**:
The robustness test simulates various failure scenarios to ensure that the system behaves as expected under failure conditions
  
## How the Testing Was Performed
**Testing Tool**: The tests were conducted using k6, a modern open-source load testing tool.

**Stress Testing**:

1- Simulating High Traffic:
The system was stressed with high numbers of virtual users (VUs). We gradually ramped up the number of VUs from a low baseline to a peak of 5000 virtual users over the course of the test.The requests per second (RPS) were increased to simulate real-world traffic spikes, pushing the system to its limits.

2- We defined failure thresholds for the test, such as a 1% failure rate (http_req_failed < 0.01), to measure how the system handles failure conditions like timeouts or errors.If the failure rate exceeded the threshold, the test stopped early, which provided insights into how the system fails under stress and how it recovers or degrades.

**Robustness Testing**:

1- Simulating Failure Conditions:
Several failure conditions were simulated, including:

- Database Down: We simulated a situation where the database is unavailable, and the system should gracefully degrade.

- Slow Database: We introduced significant delays in the database responses to test how well the system handles slow queries.

- Connection Pool Exhaustion: We simulated a situation where the database connection pool is exhausted, forcing the system to return 503 or 429 errors.

- Timeouts: Requests were simulated to timeout, and we evaluated how the system handles delays in the network.

- 404 Errors: We simulated missing resources to check how the system responds to 404 Not Found errors.

2- We defined failure thresholds for the robustness test, such as a 1% failure rate (http_req_failed < 0.01) for the normal operation scenario, to measure how the system handles failure conditions like timeouts, database issues, or missing resources.
If the failure rate exceeded the threshold, the test stopped early, providing valuable insights into how the system fails under certain failure conditions.

## How to Run the Tests
To run the stress and robustness tests, follow the steps below:

1- install k6.

**For Windows**: Run choco install k6

**For Mac**: Run brew install k6

2- Navigate to the Test Folder 

for the stress test: `src/backend/app/tests/stress`

for the roubstness test: `src/backend/app/tests/robustness`


3- Run the Tests

To run the stress test, use the following command:

**k6 run stress.js**

To run the robustness test, use the following command:

**k6 run robustness.js**


