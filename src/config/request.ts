import {getEnv} from "@/config/env";
const env = getEnv();

export default {
    // 请求相关-基础路径
    baseUrl: env.VITE_GLOB_REQUEST_BASE || "",
    // 请求相关-超时时间
    timeout: env.VITE_GLOB_REQUEST_TIMEOUT || 5000,
    // 请求相关-token名称
    tokenName: env.VITE_GLOB_REQUEST_TOKEN_NAME || "Access-Token",
    // 请求相关-返回参数名称
    fieldName: env.VITE_GLOB_REQUEST_FIELD_NAME || {
        msg: "msg",
        data: "data",
        code: "code",
    },
    // 请求相关-返回状态码
    codeStatus: env.VITE_GLOB_REQUEST_STATUS || {
        success: 1,
        fail: 0,
        expired: 1001
    },
    headers: env.VITE_GLOB_REQUEST_HEADERS || { 'Content-Type': 'application/x-www-form-urlencoded' }
}