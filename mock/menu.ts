import { MockMethod } from 'vite-plugin-mock'
import {createNameComponent} from "../src/router/createNode";

export default [
    {
        url: `/mock/menus`,
        method: 'post',
        response: ({ body }) => {
            const { page, pageSize } = body
            return {
                code: 1,
                data: [
                    {
                        path: '/',
                        component: 'Layout',
                        redirect: '/dashboard',
                        meta: { title: 'message.menu.dashboard.name', icon: 'sfont system-home' },
                        children: [
                            {
                                path: 'dashboard',
                                component: '/views/main/dashboard/index.vue',
                                meta: { title: 'message.menu.dashboard.index', icon: 'sfont system-home', hideClose: true }
                            }
                        ]
                    },
                    {
                        path: '/document',
                        component: 'Layout',
                        redirect: '/document/intro',
                        meta: { title: 'message.menu.document.name', icon: 'sfont system-document' },
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
                        meta: { title: 'message.menu.component.name', icon: 'sfont system-component' },
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
                    },
                    {
                        path: '/pages',
                        component: 'Layout',
                        redirect: '/pages/crudTable',
                        meta: { title: 'message.menu.page.name', icon: 'sfont system-page' },
                        alwayShow: true,
                        children: [
                            {
                                path: 'crudTable',
                                component: '/views/main/pages/crudTable/index.vue',
                                meta: { title: 'message.menu.page.crudTable', cache: false, roles: ['admin', 'editor'] }
                            },
                            {
                                path: 'categoryTable',
                                component: '/views/main/pages/categoryTable/index.vue',
                                meta: { title: 'message.menu.page.categoryTable', cache: true, roles: ['admin'] }
                            },
                            {
                                path: 'treeTable',
                                component: '/views/main/pages/treeTable/index.vue',
                                meta: { title: 'message.menu.page.treeTable', cache: true }
                            },
                            {
                                path: 'card',
                                component: '/views/main/pages/card/index.vue',
                                meta: { title: 'message.menu.page.card', cache: true }
                            },
                            {
                                path: 'work',
                                component: '/views/main/pages/work/index.vue',
                                meta: { title: 'message.menu.page.work' }
                            },
                            {
                                path: 'blog',
                                component: '/views/main/pages/baidu/index.vue',
                                meta: { title: 'message.menu.page.baidu' }
                            },
                        ]
                    },
                    {
                        path: '/menu',
                        component: 'Layout',
                        redirect: '/menu/menu-1',
                        alwayShow: true,
                        meta: { title: 'message.menu.menu.name', icon: 'sfont system-menu' },
                        children: [
                            {
                                path: 'menu-1',
                                component: '@/components/menu/index.vue',
                                redirect: '/menu/menu-1/menu-1-1',
                                meta: { title: 'message.menu.menu.menu_1' },
                                children: [
                                    {
                                        path: 'menu-1-1',
                                        component: '@/components/menu/index.vue',
                                        redirect: '/menu/menu-1/menu-1-1/menu-1-1-1',
                                        meta: { title: 'message.menu.menu.menu_1_1' },
                                        children: [
                                            {
                                                path: 'menu-1-1-1',
                                                component: '/views/main/menu/menu-1/menu-1-1/menu-1-1-1.vue',
                                                meta: { title: 'message.menu.menu.menu_1_1_1' },
                                            },
                                            {
                                                path: 'menu-1-1-2',
                                                component: '/views/main/menu/menu-1/menu-1-1/menu-1-1-2.vue',
                                                meta: { title: 'message.menu.menu.menu_1_1_2' },
                                            },
                                        ]
                                    },
                                    {
                                        path: 'menu-1-2',
                                        component: '/views/main/menu/menu-1/menu-1-2.vue',
                                        meta: { title: 'message.menu.menu.menu_1_2' },
                                    },
                                ]
                            },
                            {
                                path: 'menu-2',
                                component: '/views/main/menu/menu-2.vue',
                                meta: { title: 'message.menu.menu.menu_2' }
                            },
                            {
                                path: 'menu-3',
                                component: '/views/main/menu/menu-3.vue',
                                meta: { title: 'message.menu.menu.menu_3' }
                            },
                        ]
                    },
                    {
                        path: '/directive',
                        component: 'Layout',
                        redirect: '/directive/copy',
                        meta: { title: 'message.menu.directive.name', icon: 'sfont system-zidingyi' },
                        children: [
                            {
                                path: 'dragable',
                                component: '/views/main/directive/dragable.vue',
                                meta: { title: 'message.menu.directive.dragable' }
                            },
                            {
                                path: 'copy',
                                component: '/views/main/directive/copy.vue',
                                meta: { title: 'message.menu.directive.copy' }
                            },
                            {
                                path: 'waterMarker',
                                component: '/views/main/directive/waterMarker.vue',
                                meta: { title: 'message.menu.directive.waterMarker' }
                            },
                            {
                                path: 'longpress',
                                component: '/views/main/directive/longpress.vue',
                                meta: { title: 'message.menu.directive.longpress' }
                            },
                            {
                                path: 'debounce',
                                component: '/views/main/directive/debounce.vue',
                                meta: { title: 'message.menu.directive.debounce' }
                            },
                            {
                                path: 'scroll',
                                component: '/views/main/directive/infiniteScroll.vue',
                                meta: { title: 'message.menu.directive.scroll' }
                            },
                            {
                                path: 'clickOutside',
                                component: '/views/main/directive/clickOutside.vue',
                                meta: { title: 'message.menu.directive.clickOutside' }
                            }
                        ]
                    },
                    {
                        path: '/echarts',
                        component: 'Layout',
                        redirect: '/echarts/dragable',
                        meta: { title: 'message.menu.echarts.name', icon: 'sfont system-chart' },
                        children: [
                            {
                                path: 'bar',
                                component: '/views/main/echarts/bar.vue',
                                meta: { title: 'message.menu.echarts.bar' }
                            },
                            {
                                path: 'line',
                                component: '/views/main/echarts/line.vue',
                                meta: { title: 'message.menu.echarts.line' }
                            },
                            {
                                path: 'pie',
                                component: '/views/main/echarts/pie.vue',
                                meta: { title: 'message.menu.echarts.pie' }
                            },
                            {
                                path: 'radar',
                                component: '/views/main/echarts/radar.vue',
                                meta: { title: 'message.menu.echarts.radar' }
                            },
                            {
                                path: 'map',
                                component: '/views/main/echarts/map.vue',
                                meta: { title: 'message.menu.echarts.map' }
                            },
                        ]
                    },
                    {
                        path: '/systemManage',
                        component: 'Layout',
                        redirect: '/systemManage/menu',
                        meta: { title: 'message.menu.systemManage.name', icon: 'sfont system-xitongzhuangtai' },
                        alwayShow: true,
                        children: [
                            {
                                path: 'menu',
                                component: '/views/main/systemManage/menu/index.vue',
                                meta: { title: 'message.menu.systemManage.menu' }
                            },
                            {
                                path: 'role',
                                component: '/views/main/systemManage/role/index.vue',
                                meta: { title: 'message.menu.systemManage.role' }
                            },
                            {
                                path: 'user',
                                component: '/views/main/systemManage/users/index.vue',
                                meta: { title: 'message.menu.systemManage.user' }
                            }
                        ]
                    },
                    {
                        path: '/print',
                        component: 'Layout',
                        redirect: '/print/js',
                        meta: { title: 'message.menu.print.name', icon: 'sfont system-24gl-printer' },
                        children: [
                            {
                                path: 'js',
                                component: '/views/main/print/index.vue',
                                meta: { title: 'message.menu.print.jsPrint', icon: 'sfont system-24gl-printer' }
                            }
                        ]
                    },
                    {
                        path: '/system',
                        component: 'Layout',
                        redirect: '/404',
                        hideMenu: true,
                        meta: { title: 'message.menu.system.name' },
                        children: [
                            {
                                path: '/404',
                                component: '/views/system/404.vue',
                                meta: { title: 'message.menu.system.404', hideTabs: true }
                            },
                            {
                                path: '/401',
                                component: '/views/system/401.vue',
                                meta: { title: 'message.menu.system.401', hideTabs: true }
                            },
                            {
                                path: '/redirect/:path(.*)',
                                component: '/views/system/redirect.vue',
                                meta: { title: 'message.menu.system.redirect', hideTabs: true }
                            }
                        ]
                    },
                    {
                        path: '/login',
                        component: '/views/system/login.vue',
                        hideMenu: true,
                        meta: { title: 'message.system.login', hideTabs: true }
                    },
                ],
                msg: ''
            };
        }
    },
]