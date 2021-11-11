/**
 * @description 所有人可使用的参数配置列表
 * @params hideMenu: 是否隐藏当前路由结点不在导航中展示
 * @params alwayShow: 只有一个子路由时是否总是展示菜单，默认false
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import i18n from '@/locale'
import NProgress from '@/utils/system/nprogress'
import { changeTitle } from '@/utils/system/title'
import { getMenus } from '@/api/menu'
import { asyncLoadModule, loadModuleOptions } from '@/utils/admin/sfc-loader'

NProgress.configure({ showSpinner: false })

// 动态路由相关引入数据
import Layout from '@/layout/index.vue'
import MenuBox from '@/components/menu/index.vue'
import { createNameComponent } from './createNode'

// 定义一下找不到的重定向
const pathNotMatchRedirect = {
  // 找不到路由重定向到404页面
  path: "/:pathMatch(.*)",
      component: Layout,
    redirect: "/404",
    hideMenu: true
};

// 引入modules
import Dashboard from './modules/dashboard'
import Document from './modules/document'
import Pages from './modules/pages'
import Menu from './modules/menu'
import Component from './modules/component'
import Directive from './modules/directive'
import SystemManage from './modules/systemManage'
import Chart from './modules/chart'
import Print from './modules/print'
import Community from './modules/community'
import System from './modules/system'

// 聚合一下
const modulesFiles = import.meta.globEager("./modules/*.ts");

// 初始化必须要的路由
let modules: object[] = [
  ...System
]

const { t } = i18n.global

const routes: any = modules

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 登录后动态加入的路由
let asyncRoutes: RouteRecordRaw[] = [
  // ...Dashboard,
  // ...Document,
  // ...Component,
  // ...Pages,
  // ...Menu,
  // ...Directive,
  // ...Chart,
  // ...SystemManage,
  // ...Print,
  // ...Community,
]

/**
 * 转化menu菜单到router路由
 * @param menus
 */
export function transferMenuToRouter(menus: any[]): RouteRecordRaw[] {
  menus.forEach(item => {
    if(item.component == "Layout") {
      item.component = Layout;
    } else {
      // @ts-ignore
      if(typeof item.component === "string") {
        const componentPath = item.component;
        item.component = () => asyncLoadModule(componentPath, loadModuleOptions);
      }
    }
    if(item.children) {
      item.children = transferMenuToRouter(item.children);
    }
  })

  return menus;
}

// 先循环，加入既定默认
asyncRoutes.forEach(item => {
  modules.push(item)
  router.addRoute(item)
})

// 动态路由的权限新增，供登录后调用
export async function addRoutes() {
  // eachData(data, 0) // 匹配本地路由，产生一棵新树
  // data.forEach(item => { // 添加到路由表里面去
  //   modules.push(item)
  //   router.addRoute(item)
  // })
  // 与后端交互的逻辑处理，处理完后异步添加至页面
  const data = await getMenus({});
  if(data.data) {
    transferMenuToRouter(data.data).forEach(item => {
      modules.push(item)
      router.addRoute(item)
    })
  }
  router.addRoute(pathNotMatchRedirect);
}

// 重置匹配所有路由的解决方案，todo
function eachData(data: any, type: number) {
  // @ts-ignore
  data.forEach(d => {
    if (d.children && d.children.length > 0) {
      if (type === 0) {
        d.component = Layout
      } else {
        d.component = createNameComponent(MenuBox)
      }
      eachData(d.children, type + 1)
    } else {
      /* 组件匹配暂时写死，todo项 */
      // d.component = createNameComponent(() => import('@/views/main/pages/crudTable/index.vue'))
      d.component = d.component
    }
  })
  console.log(data)
}

let whiteList = ['/login'], addRoutesOver = false;

router.beforeEach(async (to, _from, next) => {
  NProgress.start();

  to.meta.title ? (changeTitle(to.meta.title)) : ""; // 动态title

  if(whiteList.indexOf(to.path) !== -1) {
    next()
  } else if (store.state.user.token) {
    if(!addRoutesOver) {
      addRoutesOver = true;
      // 如果你登录了，那么系统才会把路由加入到路由表里面，防止越权访问
      await addRoutes()
      // 动态添加路由：防止非首页刷新时跳转回首页的问题
      // 确保 addRoute() 时动态添加的路由已经被完全加载上去
      next({ ...to, replace: true });
    } else {
      next()
    }
  } else {
    next("/login"); // 全部重定向到登录页

    to.meta.title ? (changeTitle(to.meta.title)) : ""; // 动态title
  }
});

router.afterEach((to, _from) => {
  const keepAliveComponentsName = store.getters['keepAlive/keepAliveComponentsName'] || []
  const name = to.matched[to.matched.length - 1].components.default.name
  if (to.meta && to.meta.cache && name && !keepAliveComponentsName.includes(name)) {
    store.commit('keepAlive/addKeepAliveComponentsName', name)
  }
  NProgress.done();
});

export {
  modules
}

export default router
