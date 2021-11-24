import axios , { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'
import requestConfig from "@/config/request";
// @ts-ignore
import qs from "qs";
import {I18n} from "vue-i18n";

const service: AxiosInstance = axios.create({
  baseURL: requestConfig.baseUrl,
  timeout: requestConfig.timeout
})

// 请求前的统一处理
service.interceptors.request.use((config: AxiosRequestConfig) => {
    const headers = config.headers || { 'Content-Type': 'application/x-www-form-urlencoded' };

    // JWT鉴权处理
    if (store.getters['user/token']) {
        headers[requestConfig.tokenName] = store.state.user.token
    }

    // 重置header
    config.headers = headers;

    // 如果是www-x-form-urlencoded，需要转化一下参数
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];
    if(contentType.indexOf("form-urlencoded") >= 0) {
        if(Reflect.has(config, 'data') && config.method?.toUpperCase() === "GET") {
            // @ts-ignore
            const concatChar = config.url?.indexOf("?") >= 0 ? "&" : "?";
            config.url = config.url + concatChar + qs.stringify(config.data, { arrayFormat: 'brackets' });
            config.data = null;
        } else {
            config.data = qs.stringify(config.data, { arrayFormat: 'brackets' });
        }
    }

    return config
  }, (error: AxiosError) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 请求后的统一处理
service.interceptors.response.use(
  (response: AxiosResponse) => {
      const { msg: msgName, code: codeName, data: dataName } = requestConfig.fieldName;
      const { success: successCode, expired: expiredCode } = requestConfig.codeStatus;
      const resultData = response.data;

      if(codeName in resultData) {
          if(parseInt(resultData[codeName]) == parseInt(successCode)) {
              return resultData;
          } else if(parseInt(resultData[codeName]) == parseInt(expiredCode)) {
              // token过期，清除本地数据，并跳转至登录页面
              store.dispatch('user/loginOut').then(r => r)
          }
      }

      // 如果不存在code，那就仍会错误
      showError(resultData[msgName]);
      return Promise.reject(response)
  }, (error: AxiosError)=> {
      const { msg: msgName } = requestConfig.fieldName;
      const resultData = error.response?.data;

      // 如果不存在code，那就仍会错误
      showError(resultData[msgName]);
      return Promise.reject(error)
  }
)

let localMsg: any = null;

// 错误处理
function showError(msg: string) {
    if(msg.indexOf("message.")>=0) {
        let msgArr = msg.split("|");
        if(localMsg == null) {
            import("@/locale").then(data => {
                localMsg = data.default;
                showElMessage(localMsg.global.t(msgArr[0], msgArr[1] ? JSON.parse(msgArr[1]) : {}))
            })
        } else {
            showElMessage(localMsg.global.t(msgArr[0], msgArr[1] ? JSON.parse(msgArr[1]) : {}))
        }
    } else {
        showElMessage(msg);
    }
}

function showElMessage(showMessage: string) {
    ElMessage({
        message: showMessage || '服务异常',
        type: 'error',
        duration: 3 * 1000
    })
}

export default service