// 系统名称，用于显示在左上角模块，以及浏览器标题上使用,使用配置项
const systemTitle = 'message.system.title'

import {getEnv} from "@/config/env";
const env = getEnv();

export {
  systemTitle,
}

export default {
  // 是否显示logo
  logoShow: env.VITE_GLOB_LOGO_SHOW || false,
  // 是否显示logo旁文字
  logoTextShow: env.VITE_GLOB_LOGO_TEXT_SHOW || false,
  // logo地址
  logoUrl: env.VITE_GLOB_LOGO_URL || "",
  // 小logo地址
  logoSmUrl: env.VITE_GLOB_LOGO_SM_URL || "",
}