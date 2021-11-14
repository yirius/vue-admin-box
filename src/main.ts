import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import i18n from './locale'

import {installDirectives, installElementIcons, installElementPlus} from "@/install";

import 'normalize.css' // css初始化
import '@/assets/style/common.scss' // 公共css
import '@/theme/modules/chinese/index.scss'

import { baidu } from './utils/system/statistics'
if (import.meta.env.MODE !== 'development') { // 非开发环境调用百度统计
  baidu()
}

const app = createApp(App).use(router).use(store).use(i18n);
installElementPlus(app, store.state.app.elementSize);
installElementIcons(app);
installDirectives(app);
// app.config.performance = true

app.mount('#app')