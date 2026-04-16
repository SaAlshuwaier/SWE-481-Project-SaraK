import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';

console.log(`[Scenario 2: Database Down] Running at ${BASE_URL}`);
console.log(`REMINDER: Make sure you ran 'brew services stop postgresql@14' before this test!`);

const errorRate = new Rate('errors');
const fallbackSuccessRate = new Rate('fallback_success');
const degradedTrend = new Trend('degraded_duration_ms');
const totalRequests = new Counter('total_requests');

export const options = {
    vus: 5,
    duration: '2m',
    thresholds: {

        // Must not hang — should respond within 10s

        'http_req_duration': ['p(95)<10000'],
    },
};

export default function () {
    const response = http.get(`${BASE_URL}/movies/search?title=Out%20at%20the%20Wedding&page=1&pageSize=20`);
    degradedTrend.add(response.timings.duration);
    totalRequests.add(1);

    const checksPassed = check(response, {
        'returns 503 or cached 200 when DB is down': (r) => r.status === 503 || r.status === 200,
        'no stack trace in response body': (r) =>
            !r.body.includes('Exception') &&
            !r.body.includes('at com.') &&
            !r.body.includes('at org.') &&
            !r.body.includes('NullPointer'),
        'fails within 10 seconds': (r) => r.timings.duration < 10000,
    });

    if (response.status === 200) {
        fallbackSuccessRate.add(1);
    }

    if (!checksPassed) {
        console.error(`[VU ${__VU}] Status: ${response.status}, Duration: ${response.timings.duration}ms`);
    }

    sleep(2);
}

export function teardown() {
    console.log(`[Scenario 2: Database Down] DONE at ${new Date().toISOString()}`);
    console.log(`REMINDER: Restore your DB now: brew services start postgresql@14`);
}