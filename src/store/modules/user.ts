import {loginApi, getInfoApi, loginOutApi} from '@/api/user'
import {ActionContext} from 'vuex'
import login from "@/config/login";

export interface userState {
    token: string,
    info: object
}

const state = (): userState => ({
    token: '', // 登录token
    info: {},  // 用户信息
})

// getters
const getters = {
    token(state: userState) {
        return state.token
    }
}

// mutations
const mutations = {
    tokenChange(state: userState, token: string) {
        state.token = token
    },
    infoChange(state: userState, info: object) {
        state.info = info
    }
}

// actions
const actions = {
    // login by login.vue
    login({commit, dispatch}: ActionContext<userState, userState>, params: any) {
        return new Promise((resolve, reject) => {
            loginApi(params).then(res => {
                commit('tokenChange', res.data.token)
                dispatch('getInfo', {token: res.data.token}).then(infoRes => {
                  resolve(res.data.token)
                })
            }).catch(err => {
                reject(err)
            })
        })
    },
    // get user info after user logined
    getInfo({commit}: ActionContext<userState, userState>, params: any) {
        return new Promise((resolve, reject) => {
            getInfoApi(params).then(res => {
                commit('infoChange', res.data)
                resolve(res.data)
            })
        })
    },

    // login out the system after user click the loginOut button
    loginOut({commit}: ActionContext<userState, userState>) {
        loginOutApi()
            .then(res => {

            })
            .catch(error => {

            })
            .finally(() => {
                localStorage.removeItem(login.vuexPrevfix + 'tabs')
                localStorage.removeItem(login.vuexPrevfix + 'vuex')
                sessionStorage.removeItem(login.vuexPrevfix + 'vuex')
                location.reload()
            })
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
