import { getConfigFileName } from '../../build/utils';

let envData: ViteEnv;

/**
 * 获取到环境参数
 */
export function getEnv() {
    if(envData) {
        return envData;
    }

    const envName = getConfigFileName(import.meta.env);
    const env: {[key: string]: string} = (import.meta.env.DEV ? import.meta.env : window[envName as any]) as any;

    envData = parseEnv(env);
    return envData;
}

// 定义接口类型声明
export interface ViteEnv {
    VITE_PORT: number;
    VITE_OPEN: boolean;
    VITE_PROXY: any;
    VITE_PUBLIC_PATH: string;
    // 所有打包至_app.config.js中的
    VITE_GLOB_APP_SHORT_NAME: string;// 英文名称
    VITE_GLOB_CAPTCHA_URL: string;// 验证码地址


    VITE_GLOB_IS_COLLAPSE: boolean;// 是否折叠侧边
    VITE_GLOB_MENU_URL: string;// 登录相关-菜单地址
    VITE_GLOB_LOGIN_URL: string;// 登录相关-地址
    VITE_GLOB_LOGIN_LANG: string;// 登录相关-登录之后加载的基础语言包
    VITE_GLOB_LOGIN_INFO: string;// 登录相关-获取用户信息
    VITE_GLOB_LOGOUT_URL: string;// 登录相关-用户推出登录
    VITE_GLOB_LOGIN_PWD: string;// 登录相关-修改密码
    VITE_GLOB_VUEX_PREVFIX: string;// 设置缓存相关，读取vuex本地缓存的前缀

    VITE_GLOB_LOGO_SHOW: boolean;// 是否显示logo
    VITE_GLOB_LOGO_TEXT_SHOW: boolean;// 是否显示logo旁边文字
    VITE_GLOB_LOGO_URL: string;// logo地址
    VITE_GLOB_LOGO_SM_URL: string;// 小logo地址

    VITE_GLOB_REQUEST_BASE: string;// 请求相关-基础路径
    VITE_GLOB_REQUEST_TIMEOUT: number;// 请求相关-超时时间
    VITE_GLOB_REQUEST_TOKEN_NAME: string;// 请求相关-Token对应名称
    VITE_GLOB_REQUEST_FIELD_NAME: {[key: string]: any };// 请求相关-msg、code、data对应名称
    VITE_GLOB_REQUEST_STATUS: {[key: string]: any };// 请求相关-code对应的状态
    VITE_GLOB_REQUEST_HEADERS: {[key: string]: any };// 请求相关-code对应的状态

    VITE_GLOB_STATISTICS: string;// 统计代码-对应统计地址
    // 预留出来的，如果开发人员需要新增某一个默认参数，可以直接改
    [key: string]: string|number|boolean|{[key: string]: any };
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