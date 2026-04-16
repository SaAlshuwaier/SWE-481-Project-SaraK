import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';

console.log(`[Scenario 3: Pool Exhausted] Running at ${BASE_URL}`);
console.log(`REMINDER: Make sure you added 'spring.datasource.hikari.maximum-pool-size=2' to application.properties and restarted the app!`);

const errorRate = new Rate('errors');
const degradedTrend = new Trend('degraded_duration_ms');
const totalRequests = new Counter('total_requests');

export const options = {
    vus: 20,       // 20 users hammering at once to exhaust pool of 2
    duration: '2m',
    thresholds: {
        'http_req_failed': ['rate<0.95'],
        'http_req_duration': ['p(95)<3000'],   // should fail fast, not hang
        'errors': ['rate<0.95'],
    },
};

export default function () {
    const response = http.get(`${BASE_URL}/movies/search?title=Out%20at%20the%20Wedding&page=1&pageSize=20`);
    degradedTrend.add(response.timings.duration);
    totalRequests.add(1);

    const checksPassed = check(response, {
        'fails fast under pool exhaustion': (r) => r.timings.duration < 3000,
        'returns 503 or 429 or 200': (r) => r.status === 503 || r.status === 429 || r.status === 200,
        'does not crash with 500': (r) => r.status !== 500,
    });

    errorRate.add(!checksPassed);

    if (!checksPassed) {
        console.error(`[VU ${__VU}] Status: ${response.status}, Duration: ${response.timings.duration}ms`);
    }

    sleep(1);
}

export function teardown() {
    console.log(`[Scenario 3: Pool Exhausted] DONE at ${new Date().toISOString()}`);
    console.log(`REMINDER: Remove 'spring.datasource.hikari.maximum-pool-size=2' from application.properties and restart your app!`);
}