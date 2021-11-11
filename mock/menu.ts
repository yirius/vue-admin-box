import { MockMethod } from 'vite-plugin-mock'
import {createNameComponent} from "../src/router/createNode";

export default [
    {
        url: `/mock/menus`,
        method: 'post',
        response: ({ body }) => {
            const { page, pageSize } = body
            return {
                code: 200,
                data: [
                    {
                        path: '/',
                        component: 'Layout',
                        redirect: '/dashboard',
                        meta: { title: 'message.menu.dashboard.name', icon: 'el-icon-menu' },
                        children: [
                            {
                                path: 'dashboard',
                                component: '/views/main/dashboard/index.vue',
                                meta: { title: 'message.menu.dashboard.index', icon: 'el-icon-menu', hideClose: true }
                            }
                        ]
                    },
                    {
                        path: '/document',
                        component: 'Layout',
                        redirect: '/document/intro',
                        meta: { title: 'message.menu.document.name', icon: 'el-icon-document' },
                        children: [
                            {
                                path: 'intro',
                                component: '/views/main/document/intro.vue',
                                meta: { title: 'message.menu.document.intro' }
                            },
                            {
                                path: 'function',
                                component: '/views/main/document/function.vue',
                                meta: { title: 'message.menu.document.function' }
                            },
                            {
                                path: 'menu',
                                component: '/views/main/document/menu.vue',
                                meta: { title: 'message.menu.document.menu' }
                            },
                            {
                                path: 'keep-alive',
                                component: '/views/main/document/keepAlive.vue',
                                meta: { title: 'message.menu.document.keepAlive' }
                            },
                            {
                                path: 'crud',
                                component: '/views/main/document/crud.vue',
                                meta: { title: 'message.menu.document.crud' }
                            },
                            {
                                path: 'theme',
                                component: '/views/main/document/theme.vue',
                                meta: { title: 'message.menu.document.theme' }
                            }
                        ]
                    },
                    {
                        path: '/component',
                        component: 'Layout',
                        redirect: '/component/table',
                        meta: { title: 'message.menu.component.name', icon: 'el-icon-s-ticket' },
                        alwayShow: true,
                        children: [
                            {
                                path: 'button',
                                component: '/views/main/components/button/index.vue',
                                meta: { title: 'message.menu.component.button' },
                            },
                            {
                                path: 'wordEditor',
                                component: '/views/main/components/wordEditor/index.vue',
                                meta: { title: 'message.menu.component.wordEditor' },
                            },
                            {
                                path: 'mdEditor',
                                component: '/views/main/components/mdEditor/index.vue',
                                meta: { title: 'message.menu.component.mdEditor' },
                            },
                            {
                                path: 'codeEditor',
                                component: '/views/main/components/codeEditor/index.vue',
                                meta: { title: 'message.menu.component.codeEditor' },
                            },
                            {
                                path: 'jsonEditor',
                                component: '/views/main/components/jsonEditor/index.vue',
                                meta: { title: 'message.menu.component.jsonEditor' },
                            },
                            {
                                path: 'dragPane',
                                component: '/views/main/components/dragPane/index.vue',
                                meta: { title: 'message.menu.component.dragPane' },
                            },
                            {
                                path: 'map',
                                component: '/views/main/components/map/index.vue',
                                meta: { title: 'message.menu.component.map' },
                            },
                            {
                                path: 'cutPhoto',
                                component: '/views/main/components/cutPhoto/index.vue',
                                meta: { title: 'message.menu.component.cutPhoto' },
                            },
                            {
                                path: 'rightMenu',
                                component: '/views/main/components/rightMenu/index.vue',
                                meta: { title: 'message.menu.component.rightMenu' },
                            },
                            {
                                path: 'exportExcel',
                                component: '/views/main/components/exportExcel/index.vue',
                                meta: { title: 'message.menu.component.exportExcel' },
                            },
                        ]
                    }
                ],
                msg: ''
            };
        }
    },
]