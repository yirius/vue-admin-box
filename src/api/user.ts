import login from "@/config/login";
import {postRequest} from "@/api/request";

// 登录api
export function loginApi(data: object) {
  return postRequest(login.loginUrl, data)
}

// 获取用户信息Api
export function getInfoApi(data: object) {
  return postRequest(login.userInfo, data)
}

// 退出登录Api
export function loginOutApi() {
  return postRequest(login.logoutUrl, {})
}

// 获取用户信息Api
export function passwordChange(data: object) {
  return postRequest(login.changePwd, data)
}
