import { createApp } from 'vue'
import {installDirectives, installElementIcons, installElementPlus, installVxeTable} from "@/install";
import App from './App.vue'
import store from './store'
import router from './router'
import i18n from './locale'

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
installVxeTable(app);

// 这两个组件存在循环引用，所以直接注册
import layerBox from '@/components/layer/index.vue';
import vxeTableBox from "@/components/vxeTable/index.vue";
import ViewBaseComponent from '@/views/base/component.vue';
app.component("layerBox", layerBox)
    .component("vxeTableBox", vxeTableBox)
    .component("ViewBaseComponent", ViewBaseComponent);
// app.config.performance = true

app.mount('#app')