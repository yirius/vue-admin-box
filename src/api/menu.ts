import {postRequest} from "@/api/request";
import login from "@/config/login";

// 获取用户信息Api
export function getMenus(data: object) {
  return postRequest(login.menuUrl, data)
}
