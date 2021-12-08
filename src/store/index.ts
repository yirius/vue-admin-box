import { createStore, createLogger } from 'vuex'
import Persistent from './plugins/persistent'
import {userState} from "@/store/modules/user";
import {keepAliveState} from "@/store/modules/keepAlive";
import {appState} from "@/store/modules/app";
import login from "@/config/login";
const debug = import.meta.env.MODE !== 'production'
const files= import.meta.globEager('./modules/*.ts')

export interface RootState {
  user: userState,
  keepAlive: keepAliveState,
  app: appState
}

let modules: any = {}
Object.keys(files).forEach((c: string) => {
  const module = files[c].default
  const moduleName: string = c.replace(/^\.\/(.*)\/(.*)\.\w+$/, '$2')
  modules[moduleName] = module
})

// 这是一个vuex本地存储插件，默认把vuex所有数据都做存储了
// local代表存储在localStorage里面，进行永久存储
// session代表存储在sessionStorage里面，进行临时存储
// 都接收Modules的文件名数组，如：['app', 'keepAlive', 'user']
// 用户相关的数据建议直接存储在local里面，session里面会导致打开新窗口时获取不到token值，因为session只针对当前会话
const persistent = Persistent({ key: login.vuexPrevfix + 'vuex', modules, modulesKeys: {
  local: Object.keys(modules),
  session: []
} })

export default createStore<RootState>({
  modules: {
    ...modules
  },
  mutations: {
    $adminStore(state: RootState, payload: any) {
      // 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
      let nameArr = payload.name.split('.');
      let saveKey = '';
      let len = nameArr.length;
      if(len >= 2) {
        // @ts-ignore
        let obj = state[nameArr[0]];
        for(let i = 1; i < len - 1; i ++) {
          obj = obj[nameArr[i]];
        }
        obj[nameArr[len - 1]] = payload.value;
        saveKey = nameArr[0];
      } else {
        // 单层级变量，在state就是一个普通变量的情况
        // @ts-ignore
        state[payload.name] = payload.value;
        saveKey = payload.name;
      }
      // 保存变量到本地，见顶部函数定义
      // @ts-ignore
      saveLifeData(saveKey, state[saveKey])
    }
  },
  strict: debug,
  plugins: debug ? [createLogger(), persistent] : [persistent]
})
