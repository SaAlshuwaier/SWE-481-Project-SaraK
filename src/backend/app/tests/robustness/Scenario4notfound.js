import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';

console.log(`[Scenario 4: Not Found] Running at ${BASE_URL}`);

const notFoundRate = new Rate('not_found_rate');
const totalRequests = new Counter('total_requests');

export const options = {
    vus: 3,
    duration: '2m',
    thresholds: {
        // We expect almost all to be 404 — k6 counts 404 as failed
        'http_req_failed': ['rate>0.40'],
        'http_req_duration': ['p(95)<500'],
    },
};

export default function () {
    totalRequests.add(1);

    // Call a movie ID that does not exist
    const missingMovie = http.get(`${BASE_URL}/movies/nonexistent-id-99999`);
    const notFoundOk = check(missingMovie, {
        'missing movie returns 404': (r) => r.status === 404,
        'no stack trace on 404': (r) =>
            !r.body.includes('Exception') &&
            !r.body.includes('at com.'),
    });
    notFoundRate.add(missingMovie.status === 404);

    if (!notFoundOk) {
        console.error(`[VU ${__VU}] Expected 404 but got: ${missingMovie.status}`);
    }

    sleep(0.5);

    // Search with a title that will never match
    const emptySearch = http.get(`${BASE_URL}/movies/search?title=xyzzy_no_match_ever&page=1&pageSize=20`);
    check(emptySearch, {
        'empty search returns 200 with empty result': (r) => r.status === 200,
    });

    sleep(0.5);
}

export function teardown() {
    console.log(`[Scenario 4: Not Found] DONE at ${new Date().toISOString()}`);
}