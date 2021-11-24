/**
 * @description 所有人可使用的参数配置列表
 * @params hideMenu: 是否隐藏当前路由结点不在导航中展示
 * @params alwayShow: 只有一个子路由时是否总是展示菜单，默认false
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import NProgress from '@/utils/system/nprogress'
import { changeTitle } from '@/utils/system/title'
import { getMenus } from '@/api/menu'
import { getLang } from '@/api/lang'
import { asyncLoadModule, loadModuleOptions } from '@/utils/admin/sfc-loader'

NProgress.configure({ showSpinner: false })

// 在路由之前，加入语言包
getLang({});

// 动态路由相关引入数据
import Layout from '@/layout/index.vue'
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
import System from './modules/system'

// 所有的vue文件
const vuesFiles = import.meta.glob("../**/**/**.vue");

// 初始化必须要的路由, 系统内部必要的规则【404、login等】
let modules: object[] = [
  ...System
]

const routes: RouteRecordRaw[] = modules as any as RouteRecordRaw[];
// 创建路由规则
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 登录后动态加入的路由
let asyncRoutes: RouteRecordRaw[] = []

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
        let componentPath = item.component;
        if(item.component.startsWith("@") || item.component.startsWith("/@")) {
          componentPath = componentPath.replace("/@/", "../").replace("@/", "../").replace("@", "../");
          if(vuesFiles[componentPath]) {
            item.component = createNameComponent(vuesFiles[componentPath]);
          }
        } else {
          item.component = createNameComponent(() => asyncLoadModule(componentPath, loadModuleOptions).then((data: any) => {
            return {default: data}
          }));
        }
      }
    }
    if(item.children) {
      item.children = transferMenuToRouter(item.children);
    }
  })

  return menus;
}

// 动态路由的权限新增，供登录后调用, 同时，如果登录了，但刷新了界面，页自动加载
export async function addRoutes() {

  // 如果存在写死的，登录后需要加入的，也加入下
  if(asyncRoutes.length > 0) {
    asyncRoutes.forEach(item => {
      modules.push(item);
      router.addRoute(item);
    })
  }

  // 与后端交互的逻辑处理，处理完后异步添加至页面
  const data = await getMenus({});
  if(data.data) {
    transferMenuToRouter(data.data).forEach(item => {
      modules.push(item);
      router.addRoute(item);
    })
  }

  // 补充最终数据，重定向到404
  router.addRoute(pathNotMatchRedirect);
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
  modules, asyncRoutes
}

export default router
