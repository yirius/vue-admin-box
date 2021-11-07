// @ts-ignore
import { loadModule } from 'vue3-sfc-loader';
import * as Vue from 'vue';
import * as ElementPlus from 'element-plus';

// 引入vue router
import * as vueRouter from 'vue-router';

const moduleCache = {
    vue: Vue
};

export const loadModuleOptions = {
    moduleCache: moduleCache,
    async getFile(url: any) {
        return fetch(url, {
            headers: {

            },
        }).then((res) => res.text());
    },
    addStyle(textContent, scopeId) {
        const style = document.createElement('style');
        style.textContent = textContent;
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
    customBlockHandler(block, filename, options) {
        console.log(block);
        console.log(filename);
        console.log(options);
    }
};

export function asyncLoadModule(component: string, options: any) {
    return loadModule(component, options);
}
