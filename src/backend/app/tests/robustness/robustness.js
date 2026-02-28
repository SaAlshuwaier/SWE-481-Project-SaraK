import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const ENVIRONMENT = __ENV.ENV || 'development';
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';



if (!BASE_URL) {
    throw new Error('BASE_URL environment variable is required!');
}

console.log(`Running in ${ENVIRONMENT} at ${BASE_URL}`);

// Custom metrics for tracking failures and performance
const dbFailureRate = new Rate('db_failures');
const authErrorRate = new Rate('auth_errors');
const validationErrorRate = new Rate('validation_errors');
const notFoundRate = new Rate('not_found_errors');
const timeoutRate = new Rate('timeouts');
const fallbackSuccessRate = new Rate('fallback_success');

const dbFailureTrend = new Trend('db_failure_duration_ms');
const fallbackTrend = new Trend('fallback_response_time_ms');
const normalTrend = new Trend('normal_duration_ms');

const fallbackUsed = new Counter('fallback_triggered_count');
const failuresInjected = new Counter('failures_injected_count');

export const options = {
    scenarios: {
        normal_operation: {
            executor: 'constant-vus',
            vus: 8,
            duration: '5m',
            exec: 'testNormalOperation',
            tags: { test_case: 'normal' },
        },

        database_down: {
            executor: 'constant-vus',
            vus: 5,
            duration: '4m',
            exec: 'testDatabaseDown',
            tags: { test_case: 'db_down' },
            startTime: '30s',
        },

        slow_database: {
            executor: 'constant-vus',
            vus: 5,
            duration: '4m',
            exec: 'testSlowDatabase',
            tags: { test_case: 'slow_db' },
            startTime: '45s',
        },

        pool_exhausted: {
            executor: 'constant-vus',
            vus: 5,
            duration: '4m',
            exec: 'testPoolExhausted',
            tags: { test_case: 'pool_full' },
            startTime: '1m',
        },

        timeout_tests: {
            executor: 'constant-vus',
            vus: 4,
            duration: '4m',
            exec: 'testTimeouts',
            tags: { test_case: 'timeout' },
            startTime: '1m15s',
        },





        not_found_failures: {
            executor: 'constant-vus',
            vus: 3,
            duration: '3m',
            exec: 'testNotFoundFailures',
            tags: { test_case: 'not_found' },
            startTime: '2m30s',
        },


    },

    thresholds: {
        'http_req_failed{test_case:normal}': ['rate<0.01'],
        'http_req_duration{test_case:normal}': ['p(95)<500'],
        'http_req_failed{test_case:db_down}': ['rate<0.95'],
        'http_req_failed{test_case:pool_full}': ['rate<0.95'],
        'http_req_failed{test_case:slow_db}': ['rate<0.50'],
        'http_req_failed{test_case:timeout}': ['rate<0.50'],
        'http_req_failed{test_case:not_found}': ['rate>0.80'],
        http_req_duration: ['p(95)<10000'],
        db_failures: ['rate<0.95'],
    },

    tags: {
        test_suite: 'robustness-test',
        environment: ENVIRONMENT,
    },
};

function getRandomMovieId() {
    const movieIds = ['tt0012345', 'tt0067890', 'tt0135792', 'tt0246801', 'tt0357913'];
    return movieIds[Math.floor(Math.random() * movieIds.length)];
}

function getRandomStarId() {
    const starIds = ['nm0000123', 'nm0000456', 'nm0000789', 'nm0001011', 'nm0001213'];
    return starIds[Math.floor(Math.random() * starIds.length)];
}

function logError(scenario, response, vuId) {
    console.error(`[VU ${vuId}] ${scenario} failed: Status ${response.status}, Duration ${response.timings.duration}ms`);
}

export function testNormalOperation() {
    const vuId = __VU;

    const moviesRes = http.get(`${BASE_URL}/movies`);
    normalTrend.add(moviesRes.timings.duration);
    check(moviesRes, { 'movies endpoint returns 200': (r) => r.status === 200 });
    sleep(0.5);



    const movieId = getRandomMovieId();
    const detailRes = http.get(`${BASE_URL}/movies/${movieId}`);
    check(detailRes, { 'movie detail returns 200 or 404': (r) => r.status === 200 || r.status === 404 });

    sleep(1);
}

export function testDatabaseDown() {
    const vuId = __VU;
    failuresInjected.add(1);

    const response = http.get(`${BASE_URL}/movies?simulate=db-down`);
    dbFailureTrend.add(response.timings.duration);
    dbFailureRate.add(1);

    const checksPassed = check(response, {
        'db down returns 503 or 200 with cached data': (r) => r.status === 503 || r.status === 200,
        'no stack trace exposure': (r) => !r.body.includes('Exception') && !r.body.includes('at com.'),
        'user-friendly error message': (r) => r.status === 503 && r.body.includes('unavailable'),
    });

    if (response.status === 200 && response.body.includes('cached')) {
        fallbackUsed.add(1);
        fallbackSuccessRate.add(1);
        fallbackTrend.add(response.timings.duration);
    }

    if (!checksPassed) {
        logError('Database Down', response, vuId);
    }

    sleep(2);
}

export function testSlowDatabase() {
    const vuId = __VU;
    failuresInjected.add(1);

    const response = http.get(`${BASE_URL}/movies?simulate=db-slow&delay=3000`);

    const checksPassed = check(response, {
        'slow db eventually responds': (r) => r.status < 500,
        'handles timeout gracefully': (r) => (r.timings.duration > 5000 ? r.status === 504 || r.status === 503 : r.status === 200),
        'does not crash': (r) => r.status !== 500,
    });

    if (!checksPassed) {
        logError('Slow Database', response, vuId);
    }

    sleep(3);
}

export function testPoolExhausted() {
    const vuId = __VU;
    failuresInjected.add(1);

    const response = http.get(`${BASE_URL}/movies?simulate=pool-exhausted`);

    const checksPassed = check(response, {
        'fails fast': (r) => r.timings.duration < 1000,
        'returns 503 or 429': (r) => r.status === 503 || r.status === 429,
        'clear error message': (r) => r.body.includes('too many') || r.body.includes('busy') || r.body.includes('unavailable'),
    });

    if (!checksPassed) {
        logError('Pool Exhausted', response, vuId);
    }

    sleep(1);
}

export function testTimeouts() {
    const vuId = __VU;

    const timeoutTypes = [
        { delay: 2000, name: 'short' },
        { delay: 5000, name: 'medium' },
        { delay: 10000, name: 'long' },
    ];

    const scenario = timeoutTypes[Math.floor(Math.random() * timeoutTypes.length)];

    const response = http.get(`${BASE_URL}/movies?simulate=timeout&delay=${scenario.delay}`, { timeout: '8s' });

    if (response.status === 0 || response.status === 504) {
        timeoutRate.add(1);
    }

    const checksPassed = check(response, {
        [`${scenario.name} timeout handled`]: (r) => r.status === 200 || r.status === 504 || r.status === 503,
        'does not hang forever': (r) => r.timings.duration < scenario.delay + 2000,
    });

    if (!checksPassed) {
        logError(`Timeout (${scenario.name})`, response, vuId);
    }

    sleep(1);
}





export function testNotFoundFailures() {
    const vuId = __VU;

    const missingMovie = http.get(`${BASE_URL}/movies/nonexistent123`);
    check(missingMovie, { 'missing movie returns 404': (r) => r.status === 404 });

    sleep(0.5);



}



export function teardown() {
    console.log(`
==================================================
ROBUSTNESS TEST SUITE COMPLETED
==================================================
Environment: ${ENVIRONMENT}
Target URL: ${BASE_URL}
End Time: ${new Date().toISOString()}
==================================================
    `);
}