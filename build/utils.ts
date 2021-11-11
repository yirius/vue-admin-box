// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';
// @ts-ignore
import dotenv from 'dotenv';
import en from "@/locale/modules/en";

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
    return path.resolve(process.cwd(), ...dir);
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(match = 'VITE_GLOB_', confFiles = ['.env', '.env.production']) {
    let envConfig = {};
    confFiles.forEach((item) => {
        try {
            const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
            envConfig = { ...envConfig, ...env };
        } catch (error) {}
    });

    Object.keys(envConfig).forEach((key) => {
        const reg = new RegExp(`^(${match})`);
        if (!reg.test(key)) {
            Reflect.deleteProperty(envConfig, key);
        }
    });
    return envConfig;
}

/**
 * Get the configuration file variable name
 * @param env
 */
export const getConfigFileName = (env: Record<string, any>) => {
    return `__PROD__${env.VITE_GLOB_APP_SHORT_NAME || 'APP'}__CONF__`
        .toUpperCase()
        .replace(/\s/g, '');
};