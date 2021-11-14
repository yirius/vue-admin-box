import {postRequest} from "@/api/request";
import login from "@/config/login";
import i18n from "@/locale";

// 获取语言包
export function getLang(data: object) {
  if(login.loginLang) {
    return postRequest(login.loginLang, data).then(data => {
      if(data.data) {
        for(var localName in data.data) {
          i18n.global.mergeLocaleMessage(localName, {message: data.data[localName]});
        }
      }
    })
  }
}
