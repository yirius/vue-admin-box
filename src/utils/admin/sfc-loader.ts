// @ts-ignore
import { loadModule } from 'vue3-sfc-loader';
import * as vue from 'vue';
import * as vuei18n from 'vue-i18n'
// 引入vue router
import * as vueRouter from 'vue-router';
import * as ElementPlus from 'element-plus';
import * as ElementIcons from '@element-plus/icons';
import * as VueUseCore from '@vueuse/core';
// @ts-ignore
import * as throttleDebounce from 'throttle-debounce';
// @ts-ignore
import * as sortablejs from 'sortablejs';
import * as echartsCore from 'echarts/core';
import * as echartsRenderers from 'echarts/renderers';
import * as echartsCharts from 'echarts/charts';
import * as echartsComponents from 'echarts/components';
import store from "@/store";
import requestConfig from "@/config/request";

// 文件的组合
const allFiles = import.meta.glob("../../**/**/**.*");
// 已经执行过，引入了的
let importedFiles: Record<string, {[key: string]: any}> = {};

/**
 * 获取模块的相关参数
 */
export const loadModuleOptions = {
    moduleCache: {
        vue,
        'vue-router': vueRouter,
        '@vueuse/core': VueUseCore,
        'element-plus': ElementPlus,
        '@element-plus/icons': ElementIcons,
        'vue-i18n': vuei18n,
        'throttle-debounce': throttleDebounce,
        'sortablejs': sortablejs,
        'echarts/core': echartsCore,
        'echarts/renderers': echartsRenderers,
        'echarts/charts': echartsCharts,
        'echarts/components': echartsComponents
    },
    /**
     * 异步进行文件获取
     * @param url
     */
    async getFile(url: any) : Promise<any> {
        if(url.startsWith("@") || url.startsWith("/@")) {
            return "";
        } else {
            let headers = {};
            // JWT鉴权处理
            if (store.getters['user/token']) {
                // @ts-ignore
                headers[requestConfig.tokenName] = store.state.user.token
            }

            return fetch(url, {
                headers: headers,
            }).then((res) => res.text());
        }
    },
    /**
     * 添加scoped的样式
     * @param textContent
     * @param scopeId
     */
    addStyle(textContent: string, scopeId: string) {
        const style = document.createElement('style');
        style.textContent = textContent;
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
    /**
     * 解析模块
     * @param type
     * @param source
     * @param path
     * @param options
     */
    async handleModule(type: string, source: any, path: string, options: any) {
        if(path.startsWith("@") || path.startsWith("/@")) {
            // 说明是引入系统内文件
            let realPath: string = path.replace("/@/", "../../").replace("@/", "../../");
            if(!type && path.indexOf(".") == -1) realPath += ".ts";
            if(allFiles[realPath]) {
                if(!importedFiles[realPath]) {
                    importedFiles[realPath] = await allFiles[realPath]();
                }
                if(realPath.indexOf(".vue") >= 0) {
                    return importedFiles[realPath].default;
                }
                return importedFiles[realPath];
            }
            console.error(realPath);
            //todo  其他的不知明文件，需要未来遇到了再去
            return "";
        }
    }
};

/**
 * 异步引入模块
 * @param component
 * @param options
 */
export function asyncLoadModule(component: string, options: any) {
    return loadModule(component, options);
}
