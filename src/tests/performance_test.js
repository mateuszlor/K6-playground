import http from 'k6/http';
import { check } from 'k6';
import { loadEnvConfig } from './lib/config_loader.js';
import { jUnit, textSummary } from './lib/junit.js';

// Get environment and test type from environment variables
const env = __ENV.ENV || 'dev';
const testType = __ENV.TEST_TYPE || 'smoke';

// Load configurations
const commonConfig = JSON.parse(open('../../config/common.json'));
const envConfig = loadEnvConfig(env);

// Export options based on test type
if (!commonConfig[testType]) {
    throw new Error(`Unknown test type: ${testType}. Available types: ${Object.keys(commonConfig).join(', ')}`);
}

export const options = commonConfig[testType];

export default function () {
    const res = http.get(envConfig.baseUrl);
    check(res, { 'status was 200': (r) => r.status == 200 });
}

export function handleSummary(data) {
    const reportPath = `reports/xml/result-${testType}.xml`;
    return {
        [reportPath]: jUnit(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}
