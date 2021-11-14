import request from '@/utils/system/request';
import {AxiosRequestConfig, Method} from "axios";
import {deepMerge} from "@/utils/tools/objects";
import requestConfig from "@/config/request";

/**
 * 基础参数
 * @param url
 * @param data
 * @param config
 */
export function baseRequest(url: string, data: object, config: AxiosRequestConfig) {
    return request(deepMerge({
        url: url, data,
        headers: requestConfig.headers
    }, config))
}

/**
 * get请求
 * @param url
 * @param data
 */
export function getRequest(url: string, data: object) {
    return baseRequest(url, data, {
        method: "get"
    })
}

/**
 * post请求
 * @param url
 * @param data
 */
export function postRequest(url: string, data: object) {
    return baseRequest(url, data, {
        method: "post"
    })
}

/**
 * put请求
 * @param url
 * @param data
 */
export function putRequest(url: string, data: object) {
    return baseRequest(url, data, {
        method: "put"
    })
}

/**
 * delete请求
 * @param url
 * @param data
 */
export function deleteRequest(url: string, data: object) {
    return baseRequest(url, data, {
        method: "delete"
    })
}