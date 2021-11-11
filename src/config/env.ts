import { getConfigFileName } from '../../build/utils';

/**
 * 获取到环境参数
 */
export function getEnv() {
    const envName = getConfigFileName(import.meta.env);

    const env: {[key: string]: string} = (import.meta.env.DEV ? import.meta.env : window[envName as any]) as any;

    return parseEnv(env);
}

// 定义接口类型声明
export interface ViteEnv {
    VITE_PORT: number;
    VITE_OPEN: boolean;
    VITE_PROXY: any;
    VITE_PUBLIC_PATH: string;
    // 所有打包至_app.config.js中的
    VITE_GLOB_APP_TITLE: string;// 网站名
    VITE_GLOB_APP_SUB_TITLE: string;// 登录时候显示的subtitle
    VITE_GLOB_APP_SHORT_NAME: string;// 英文名称
    VITE_GLOB_CAPTCHA_URL: string;// 验证码地址
    // 预留出来的，如果开发人员需要新增某一个默认参数，可以直接改
    [key: string]: string|number|boolean;
}

/**
 * 包装环境参数
 * @param env
 */
export function parseEnv(env: {[key: string]: string}): ViteEnv {
    // 找到VITE_GLOB_APP_TITLE，校验参数真实性
    const VITE_GLOB_APP_TITLE = env['VITE_GLOB_APP_TITLE'] || '';
    if (!/[a-zA-Z\\_]*/.test(VITE_GLOB_APP_TITLE)) {
        // eslint-disable-next-line no-console
        console.warn(
            `VITE_GLOB_APP_TITLE Variables can only be characters/underscores, please modify in the environment variables and re-running.`
        );
    }

    var envData: {[key: string]: any} = {};
    for(const envFieldName in env) {
        if(envFieldName.startsWith("VITE")) {
            try{
                if(!isNaN(parseInt(env[envFieldName]))) {
                    envData[envFieldName] = parseInt(env[envFieldName]);
                } else if(!isNaN(parseFloat(env[envFieldName]))) {
                    envData[envFieldName] = parseFloat(env[envFieldName]);
                } else if(env[envFieldName].toLowerCase() == "true") {
                    envData[envFieldName] = true;
                } else if(env[envFieldName].toLowerCase() == "false") {
                    envData[envFieldName] = false;
                } else if(env[envFieldName].startsWith("{") || env[envFieldName].startsWith("[")) {
                    envData[envFieldName] = JSON.parse(env[envFieldName].replace(new RegExp("\\\\", "g"), ''));
                } else {
                    envData[envFieldName] = env[envFieldName];
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            envData[envFieldName] = env[envFieldName];
        }
    }

    return <ViteEnv> envData;
}