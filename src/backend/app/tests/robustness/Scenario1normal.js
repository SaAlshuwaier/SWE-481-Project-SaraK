import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';

console.log(`[Scenario 1: Normal Operation] Running at ${BASE_URL}`);

const errorRate = new Rate('errors');
const normalTrend = new Trend('normal_duration_ms');
const totalRequests = new Counter('total_requests');
const totalFailures = new Counter('total_failures');

export const options = {
    vus: 8,
    duration: '2m',
    thresholds: {
        'http_req_failed': ['rate<0.01'],         // less than 1% failures
        'http_req_duration': ['p(95)<500'],        // 95% of requests under 500ms
        'errors': ['rate<0.01'],
    },
};

export default function () {
    // Hit movies search
    const moviesRes = http.get(`${BASE_URL}/movies/search?title=Out%20at%20the%20Wedding&page=1&pageSize=20`);
    normalTrend.add(moviesRes.timings.duration);
    const moviesOk = check(moviesRes, {
        'movies endpoint returns 200': (r) => r.status === 200,
        'response has body': (r) => r.body && r.body.length > 0,
    });
    errorRate.add(!moviesOk);
    totalRequests.add(1);
    if (!moviesOk) totalFailures.add(1);
    sleep(0.5);

    // Hit genres
    const genresRes = http.get(`${BASE_URL}/genres`);
    normalTrend.add(genresRes.timings.duration);
    const genresOk = check(genresRes, {
        'genres endpoint returns 200': (r) => r.status === 200,
    });
    errorRate.add(!genresOk);
    totalRequests.add(1);
    if (!genresOk) totalFailures.add(1);

    sleep(1);
}

export function teardown() {
    console.log(`[Scenario 1: Normal Operation] DONE at ${new Date().toISOString()}`);
}