import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ============================================
// CONFIGURATION
// ============================================
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';
const ENVIRONMENT = __ENV.ENV || 'development';

console.log('Stress Test Starting...');
console.log(`Target URL: ${BASE_URL}`);
console.log(`Environment: ${ENVIRONMENT}`);

// ============================================
// CUSTOM METRICS
// ============================================
const errorRate = new Rate('errors');
const authErrors = new Rate('auth_errors');
const cartErrors = new Rate('cart_errors');
const checkoutErrors = new Rate('checkout_errors');
const movieErrors = new Rate('movie_errors');

const authTrend = new Trend('auth_duration');
const cartTrend = new Trend('cart_duration');
const checkoutTrend = new Trend('checkout_duration');
const movieTrend = new Trend('movie_duration');
const searchTrend = new Trend('search_duration');

// ============================================
// STRESS TEST CONFIGURATION
// ============================================
export const options = {
    scenarios: {
        stress_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '2m', target: 50 },
                { duration: '2m', target: 100 },
                { duration: '2m', target: 200 },
                { duration: '2m', target: 500 },  // Ramp up rapidly to a high load
                { duration: '2m', target: 1000 },  // Overwhelm the system further
                { duration: '5m', target: 2000 },  // Maintain high load
                { duration: '5m', target: 5000 },  // Heavy traffic to force failure
                { duration: '2m', target: 0 },    // Ramp down and check recovery
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true, delayAbortEval: '1m' }],
        http_req_duration: [
            'p(95)<2000',  // Set tight limits on request duration
            'p(99)<5000',  // Force the system to fail when response time exceeds 5 seconds
        ],
        errors: ['rate<0.05'],  // Force failure if the error rate is more than 5%
    },
    tags: {
        test_type: 'stress-test',
        environment: ENVIRONMENT,
        timestamp: new Date().toISOString(),
    },
};

// ============================================
// SETUP
// ============================================
export function setup() {
    const res = http.get(`${BASE_URL}/genres`);
    if (res.status !== 200) {
        throw new Error(`Server health check failed before test start. Status: ${res.status}`);
    }
    console.log(`Server reachable. Health check status: ${res.status}.`);
    return { startTime: new Date().toISOString() };
}

// ============================================
// TEST DATA
// ============================================
const movieIds = ['tt0012345', 'tt0067890', 'tt0135792', 'tt0246801', 'tt0357913'];
const starIds = ['nm0000123', 'nm0000456', 'nm0000789', 'nm0001011', 'nm0001213'];
const genreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Generate large payloads to simulate heavy requests
function generateHeavyPayload() {
    const payload = {
        username: 'testuser_' + Math.random().toString(36).substr(2, 9),
        password: 'Test@123456',
        email: `testuser_${Math.random().toString(36).substr(2, 9)}@example.com`,
        firstName: 'Heavy',
        lastName: 'Load',
        cart: new Array(1000).fill({ movieId: movieIds[Math.floor(Math.random() * movieIds.length)], quantity: 5 }),  // Large cart with 1000 items
    };
    return payload;
}

// ============================================
// AUTH
// ============================================
function testAuth() {
    const userData = generateHeavyPayload();  // Generate heavy request payload

    // Register
    const registerRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify(userData), {
        headers: { 'Content-Type': 'application/json' },
        tags: { type: 'auth', operation: 'register' },
    });

    authTrend.add(registerRes.timings.duration);
    const registerOk = check(registerRes, {
        'register status is 200': (r) => r.status === 200,
    });
    recordError(authErrors, !registerOk);

    // Login immediately after register
    const loginRes = http.post(
        `${BASE_URL}/auth/login`,
        JSON.stringify({ username: userData.username, password: userData.password }),
        {
            headers: { 'Content-Type': 'application/json' },
            tags: { type: 'auth', operation: 'login' },
        }
    );

    authTrend.add(loginRes.timings.duration);
    const loginOk = check(loginRes, {
        'login status is 200': (r) => r.status === 200,
    });
    recordError(authErrors, !loginOk);
}

// ============================================
// CART
// ============================================
function testCart() {
    // Get cart
    const getCartRes = http.get(`${BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${vuSession.token}` },
        tags: { type: 'cart', operation: 'getCart' },
    });

    cartTrend.add(getCartRes.timings.duration);
    recordError(cartErrors, getCartRes.status !== 200);

    // Add item with a heavy request
    const cartItem = generateHeavyPayload().cart[Math.floor(Math.random() * 1000)];

    const addItemRes = http.post(`${BASE_URL}/cart/addItem`, JSON.stringify(cartItem), {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vuSession.token}` },
        tags: { type: 'cart', operation: 'addItem' },
    });

    cartTrend.add(addItemRes.timings.duration);
    const addOk = check(addItemRes, { 'add item status is 200': (r) => r.status === 200 });
    recordError(cartErrors, !addOk);
}

// ============================================
// CHECKOUT
// ============================================
function testCheckout() {
    const checkoutRes = http.post(`${BASE_URL}/checkout`, JSON.stringify(generateHeavyPayload()), {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${vuSession.token}` },
        tags: { type: 'checkout', operation: 'process' },
    });

    checkoutTrend.add(checkoutRes.timings.duration);

    const checkoutOk = check(checkoutRes, {
        'checkout received a response': (r) => r.status !== 0,
        'checkout response has message': (r) => r.body && r.body.includes('message'),
    });

    recordError(checkoutErrors, !checkoutOk);
}

// ============================================
// MOVIES
// ============================================
function testMovies() {
    // Simulate searching for a movie with a very heavy payload
    const searchUrl = `${BASE_URL}/movies/search?title=The+Matrix&year=1999&director=The+Wachowskis&page=1&pageSize=5000`;  // Search with large result set
    const searchRes = http.get(searchUrl, {
        tags: { type: 'movie', operation: 'search' },
    });

    searchTrend.add(searchRes.timings.duration);
    recordError(movieErrors, searchRes.status !== 200);
    check(searchRes, { 'search status is 200': (r) => r.status === 200 });
}

// ============================================
// MAIN TEST FUNCTION
// ============================================
export default function () {
    try {
        // Each VU will make a very heavy request by sending a large payload or triggering large responses
        testAuth();
        testCart();
        testCheckout();
        testMovies();
    } catch (e) {
        console.log(`Unhandled error in VU ${__VU}: ${e}`);
        errorRate.add(1);
    }

    // Introduce some random short sleep time to simulate "thinking time" between requests
    sleep(Math.random() * 0.4 + 0.1);
}

// ============================================
// TEARDOWN
// ============================================
export function teardown(data) {
    console.log('STRESS TEST COMPLETED');
    console.log(`Environment: ${ENVIRONMENT}`);
    console.log(`Target URL: ${BASE_URL}`);
    console.log(`Started at: ${data.startTime}`);
    console.log(`Finished at: ${new Date().toISOString()}`);
}