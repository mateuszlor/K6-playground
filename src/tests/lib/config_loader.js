
/**
 * Loads the environment specific configuration file.
 * @param {string} env - The environment name (e.g., 'dev', 'prod').
 * @returns {object} The parsed configuration object.
 */
export function loadEnvConfig(env) {
    const configPath = `../../config/env/${env}.json`;
    let rawConfig;

    try {
        // dynamic open() call
        rawConfig = open(configPath);
    } catch (e) {
        throw new Error(`Failed to open configuration for environment '${env}' at '${configPath}'. Error: ${e.message}`);
    }

    if (!rawConfig) {
        throw new Error(`Configuration file for environment '${env}' is empty or not found at path: ${configPath}`);
    }

    try {
        return JSON.parse(rawConfig);
    } catch (e) {
        throw new Error(`Failed to parse configuration for environment '${env}'. Error: ${e.message}`);
    }
}
