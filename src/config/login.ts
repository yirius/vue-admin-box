import {getEnv} from "@/config/env";
const env = getEnv();

export default {
    // captcha的地址, 如果为""则不显示验证码
    captchaUrl: env.VITE_GLOB_CAPTCHA_URL || "",
    // 登录相关-菜单地址
    menuUrl: env.VITE_GLOB_MENU_URL || "/thinker/admin/menus",
    // 登录相关-地址
    loginUrl: env.VITE_GLOB_LOGIN_URL || "/thinker/admin/login",
    // 登录相关-登录之后加载的基础语言包
    loginLang: env.VITE_GLOB_LOGIN_LANG || "",
    // 登录相关-登录之后加载的基础语言包
    userInfo: env.VITE_GLOB_LOGIN_INFO || "",
    // 登录相关-登录之后加载的基础语言包
    logoutUrl: env.VITE_GLOB_LOGOUT_URL || "",
    // 登录相关-登录之后加载的基础语言包
    changePwd: env.VITE_GLOB_LOGIN_PWD || "",
}