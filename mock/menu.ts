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
                        path: '/component',
                        component: 'Layout',
                        redirect: '/component/button',
                        meta: { title: 'message.menu.component.name', icon: 'el-icon-s-ticket' },
                        alwayShow: true,
                        children: [
                            {
                                path: 'button',
                                component: '/views/components/button/index.vue',
                                meta: { title: 'message.menu.component.button' },
                            }
                        ]
                    }
                ],
                msg: ''
            };
        }
    },
]