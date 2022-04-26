import {Component} from "vue";
import {App} from "@vue/runtime-core";

import ElementPlus from 'element-plus'
import * as ElementIcons from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css' // 引入基于断点的隐藏类
import 'element-plus/dist/index.css'

import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import 'vxe-table/lib/style.css'
import 'vxe-table-plugin-element/dist/style.css'
VXETable.use(VXETablePluginElement)
VXETable.use(VXETablePluginExportXLSX)

/**
 * 安装图标
 */
const ElementIconAll = ElementIcons as any as {[key: string]: Component};
export function installElementIcons(app: App) {
    for (let elementIconAllKey in ElementIconAll) {
        app.component(elementIconAllKey, ElementIconAll[elementIconAllKey]);
    }
}

/**
 * 安装element-plus
 * @param app
 * @param size
 */
export function installElementPlus(app: App, size: string) {
    app.use(ElementPlus, { size: size })
}

/**
 * 安装指令
 */
const directivesFiles = import.meta.globEager("./directive/*/*.ts");
export function installDirectives(app: App) {
    // 注册一下指令，否则sfc界面无法使用
    for (var directive in directivesFiles) {
        app.directive(
            directive.replace("./directive/", "").replace("/index.ts", ""),
            directivesFiles[directive].default
        );
    }
}

/**
 * 安装element-plus
 * @param app
 * @param size
 */
export function installVxeTable(app: App) {
    app.use(VXETable);
}