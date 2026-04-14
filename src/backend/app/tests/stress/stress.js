import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ============================================
// CONFIGURATION
// ============================================
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';
const ENVIRONMENT = __ENV.ENV || 'development';

const FAILURE_RATE_THRESHOLD = 0.10;  // 10% error rate = system is failing
const SLOW_RESPONSE_THRESHOLD = 3000;  // 3s p95 = system is degraded
const CONSECUTIVE_FAIL_LIMIT = 20;    // 20 back-to-back failures = dead

// ============================================
// METRICS
// ============================================
const errorRate = new Rate('errors');
const movieErrors = new Rate('movie_errors');
const genreErrors = new Rate('genre_errors');

const movieTrend = new Trend('movie_duration');
const genreTrend = new Trend('genre_duration');

const totalRequests = new Counter('total_requests');
const totalFailures = new Counter('total_failures');

// ============================================
// PER-VU STATE
// ============================================
let consecutiveFailures = 0;
let breakdownDetected = false;
const WINDOW_SIZE = 50;
let recentResults = [];

function recordResult(success) {
    recentResults.push(success);
    if (recentResults.length > WINDOW_SIZE) recentResults.shift();
    var failures = recentResults.filter(function (r) { return !r; }).length;
    var localErrorRate = failures / recentResults.length;
    if (!success) { consecutiveFailures++; } else { consecutiveFailures = 0; }
    return { localErrorRate: localErrorRate, consecutiveFailures: consecutiveFailures };
}

function recordError(rateMetric, isError) {
    rateMetric.add(isError ? 1 : 0);
    errorRate.add(isError ? 1 : 0);
    totalRequests.add(1);
    if (isError) totalFailures.add(1);
    return isError;
}

// ============================================
// STAGES — ramp up until it breaks
// ============================================
export const options = {
    scenarios: {
        stress_ramp: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 50 },
                { duration: '1m', target: 100 },
                { duration: '1m', target: 200 },
                { duration: '1m', target: 400 },
                { duration: '1m', target: 800 },
                { duration: '2m', target: 1500 },
                { duration: '2m', target: 3000 },
                { duration: '2m', target: 5000 },
                { duration: '1m', target: 0 },
            ],
            gracefulRampDown: '15s',
        },
    },
    thresholds: {
        'errors': [{ threshold: 'rate<' + FAILURE_RATE_THRESHOLD, abortOnFail: true, delayAbortEval: '30s' }],
        'http_req_duration': [{ threshold: 'p(95)<' + SLOW_RESPONSE_THRESHOLD, abortOnFail: true, delayAbortEval: '30s' }],
        'http_req_failed': [{ threshold: 'rate<0.10', abortOnFail: true, delayAbortEval: '20s' }],
        'movie_errors': ['rate<0.15'],
        'genre_errors': ['rate<0.15'],
    },
    tags: {
        test_type: 'stress-failfast',
        environment: ENVIRONMENT,
    },
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

// ============================================
// SETUP — probe endpoints once before load
// ============================================
export function setup() {
    console.log('');
    console.log('Fail-Fast Stress Test Starting...');
    console.log('Target: ' + BASE_URL + ' | Env: ' + ENVIRONMENT);
    console.log('Break triggers: error_rate>' + (FAILURE_RATE_THRESHOLD * 100) + '% | p95>' + SLOW_RESPONSE_THRESHOLD + 'ms | consecutive_fails>' + CONSECUTIVE_FAIL_LIMIT);
    console.log('');
    console.log('--- SETUP: Diagnostic probe ---');

    var genresRes = http.get(BASE_URL + '/genres', { timeout: '10s' });
    console.log('  GET /genres              -> ' + genresRes.status);
    if (genresRes.status !== 200) {
        throw new Error('[ABORT] /genres returned ' + genresRes.status + '. Is the server running?');
    }

    var movieRes = http.get(BASE_URL + '/movies/search?title=Matrix&page=1&pageSize=10', { timeout: '10s' });
    console.log('  GET /movies/search       -> ' + movieRes.status);

    var browseRes = http.get(BASE_URL + '/movies/browseByFirstLetter?startsWith=A&page=1&pageSize=10', { timeout: '10s' });
    console.log('  GET /movies/browseByFirstLetter -> ' + browseRes.status);

    var genreOk = genresRes.status === 200;
    var movieOk = movieRes.status === 200;
    var browseOk = browseRes.status === 200;

    console.log('');
    console.log('  /genres              OK? ' + (genreOk ? 'YES' : 'NO <- PROBLEM'));
    console.log('  /movies/search       OK? ' + (movieOk ? 'YES' : 'NO <- PROBLEM'));
    console.log('  /movies/browseByFirstLetter OK? ' + (browseOk ? 'YES' : 'NO <- PROBLEM'));
    console.log('');

    if (!genreOk || !movieOk || !browseOk) {
        console.log('  WARNING: Some endpoints are failing. Test will abort quickly.');
    } else {
        console.log('  All endpoints healthy. Starting ramp-up...');
    }

    return { startTime: new Date().toISOString(), startEpoch: Date.now() };
}

// ============================================
// SEARCH VARIATIONS — realistic traffic mix
// ============================================
var searchQueries = [
    '/movies/search?title=The+Matrix&year=1999&page=1&pageSize=20',
    '/movies/search?title=Inception&page=1&pageSize=20',
    '/movies/search?title=Godfather&page=1&pageSize=20',
    '/movies/search?director=Spielberg&page=1&pageSize=20',
    '/movies/search?title=Star+Wars&page=1&pageSize=20',
    '/movies/search?page=1&pageSize=20',
    '/movies/search?title=Avengers&page=2&pageSize=20',
];

var browseLetters = ['A', 'B', 'C', 'D', 'E', 'M', 'S', 'T'];

// ============================================
// TEST FUNCTIONS
// ============================================
function testMovieSearch() {
    var query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
    var res = http.get(BASE_URL + query, { tags: { op: 'movie_search' } });
    movieTrend.add(res.timings.duration);
    check(res, { 'movie search 200': function (r) { return r.status === 200; } });
    return recordError(movieErrors, res.status !== 200);
}

function testGenres() {
    var res = http.get(BASE_URL + '/genres', { tags: { op: 'genres' } });
    genreTrend.add(res.timings.duration);
    check(res, { 'genres 200': function (r) { return r.status === 200; } });
    return recordError(genreErrors, res.status !== 200);
}

function testBrowse() {
    var letter = browseLetters[Math.floor(Math.random() * browseLetters.length)];
    var res = http.get(BASE_URL + '/movies/browseByFirstLetter?startsWith=' + letter + '&page=1&pageSize=20', { tags: { op: 'browse' } });
    movieTrend.add(res.timings.duration);
    check(res, { 'browse 200': function (r) { return r.status === 200; } });
    return recordError(movieErrors, res.status !== 200);
}

// ============================================
// MAIN VU LOOP
// ============================================
export default function () {
    if (breakdownDetected) {
        sleep(0.5);
        return;
    }

    var anyFailed = false;
    try {
        // Realistic traffic mix: 50% search, 30% browse, 20% genres
        var roll = Math.random();
        var failed;
        if (roll < 0.5) {
            failed = testMovieSearch();
        } else if (roll < 0.8) {
            failed = testBrowse();
        } else {
            failed = testGenres();
        }
        anyFailed = failed;
    } catch (e) {
        console.error('[VU ' + __VU + '] Exception: ' + (e.message || e));
        errorRate.add(1);
        totalFailures.add(1);
        anyFailed = true;
    }

    var result = recordResult(!anyFailed);
    var localErrRate = result.localErrorRate;
    var cf = result.consecutiveFailures;

    if (cf >= CONSECUTIVE_FAIL_LIMIT && !breakdownDetected) {
        breakdownDetected = true;
        console.error('[BREAKDOWN] VU=' + __VU + ' | consecutive_failures=' + cf + ' | error_rate=' + (localErrRate * 100).toFixed(1) + '% | time=' + new Date().toISOString());
    }

    if (localErrRate >= FAILURE_RATE_THRESHOLD && recentResults.length >= WINDOW_SIZE && !breakdownDetected) {
        breakdownDetected = true;
        console.error('[HIGH ERROR RATE] VU=' + __VU + ' | rate=' + (localErrRate * 100).toFixed(1) + '% | time=' + new Date().toISOString());
    }

    sleep(Math.random() * 0.3 + 0.1);
}

// ============================================
// TEARDOWN
// ============================================
export function teardown(data) {
    var durationS = ((Date.now() - (data.startEpoch || Date.now())) / 1000).toFixed(1);
    console.log('');
    console.log('==========================================');
    console.log('      STRESS TEST COMPLETED               ');
    console.log('==========================================');
    console.log('Environment : ' + ENVIRONMENT);
    console.log('Target URL  : ' + BASE_URL);
    console.log('Started at  : ' + data.startTime);
    console.log('Finished at : ' + new Date().toISOString());
    console.log('Duration    : ' + durationS + 's');
    console.log('');
    console.log('Error rate limit       : ' + (FAILURE_RATE_THRESHOLD * 100) + '%');
    console.log('p95 latency limit      : ' + SLOW_RESPONSE_THRESHOLD + 'ms');
    console.log('Consecutive fail limit : ' + CONSECUTIVE_FAIL_LIMIT);
    console.log('==========================================');
}

// ============================================
// SUMMARY
// ============================================
export function handleSummary(data) {
    var errRate = data.metrics['errors'] ? (data.metrics['errors'].values['rate'] * 100).toFixed(2) : 'N/A';
    var p95 = data.metrics['http_req_duration'] ? data.metrics['http_req_duration'].values['p(95)'].toFixed(0) : 'N/A';
    var p99 = data.metrics['http_req_duration'] ? data.metrics['http_req_duration'].values['p(99)'].toFixed(0) : 'N/A';
    var totalReq = data.metrics['http_reqs'] ? data.metrics['http_reqs'].values['count'] : 'N/A';

    var lines = [
        '',
        '╔══════════════════════════════════════════╗',
        '║        BREAKDOWN POINT REPORT            ║',
        '╚══════════════════════════════════════════╝',
        '  Total Requests  : ' + totalReq,
        '  Error Rate      : ' + errRate + '%',
        '  p95 Latency     : ' + p95 + 'ms',
        '  p99 Latency     : ' + p99 + 'ms',
        '',
        '  Threshold Results:',
    ];

    if (data.thresholds) {
        var names = Object.keys(data.thresholds);
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var result = data.thresholds[name];
            lines.push('    ' + name + ' : ' + (result.ok ? 'PASS' : 'FAIL <- BREAKDOWN POINT'));
        }
    }

    lines.push('');
    lines.push('  FAIL = the system could not keep up at this load.');
    lines.push('  Check VU count in stage timings for exact breakdown point.');
    lines.push('==========================================');


    return {
        stdout: lines.join('\n'),
        'breakdown-report.json': JSON.stringify({
            test_type: 'stress-failfast',
            environment: ENVIRONMENT,
            target_url: BASE_URL,
            finished_at: new Date().toISOString(),
            error_rate_pct: errRate,
            p95_latency_ms: p95,
            p99_latency_ms: p99,
            total_requests: totalReq,
            thresholds: data.thresholds,
        }, null, 2),
    };
}
