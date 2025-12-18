import http from 'k6/http';
import { check, sleep } from 'k6';

import { loadEnvConfig } from './lib/config_loader.js';

const env = __ENV.ENV || 'dev';

const commonConfig = JSON.parse(open('../../config/common.json'));
const envConfig = loadEnvConfig(env);

import { jUnit, textSummary } from './lib/junit.js';

export const options = commonConfig.load;

export default function () {
    const res = http.get(envConfig.baseUrl);

    check(res, {
        'status was 200': (r) => r.status == 200,
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        'reports/xml/result-load.xml': jUnit(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}
