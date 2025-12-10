
import http from 'k6/http';
import { check, sleep } from 'k6';

const config = JSON.parse(open('../config.json'));

import { jUnit, textSummary } from '../lib/junit.js';

export const options = config.smoke;

export default function () {
    const res = http.get(config.baseUrl);
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}

export function handleSummary(data) {
    return {
        'reports/xml/result-smoke.xml': jUnit(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}

