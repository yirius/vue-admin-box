// @ts-ignore
import { loadModule } from 'vue3-sfc-loader';
import * as vue from 'vue';
import * as vuei18n from 'vue-i18n'
// 引入vue router
import * as vueRouter from 'vue-router';
import ElementPlus from 'element-plus'

/**
 * 获取模块的相关参数
 */
export const loadModuleOptions = {
    moduleCache: {
        vue,
        'vue-router': vueRouter,
        'element-plus': ElementPlus,
        'vue-i18n': vuei18n
    },
    /**
     * 异步进行文件获取
     * @param url
     */
    async getFile(url: any) : Promise<any> {
        if(url.startsWith("@") || url.startsWith("/@")) {
            return "";
        } else {
            return fetch(url, {
                headers: {

                },
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
            let realPath = path.replace("/@/", "").replace("@/", "");
            if(!type && realPath.indexOf(".") == -1) realPath += ".ts";
            if(type === ".vue") {
                // @ts-ignore
                return (await import(`../../${realPath}`)).default;
            } else {
                // @ts-ignore
                return await import(`../../${realPath}`);
            }
        } else if(type === ".ts") {
            const data = await fetch(path, {}).then((res) => res.text());
            return eval("function exportDefault() {};" + data.replace("export default", "exportDefault"));
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
