import { loginApi, getInfoApi } from '@/api/user'
import { ActionContext } from 'vuex'
import menuList from '../menuList'

const modules = import.meta.glob('@/views/main/**/*.vue')

export interface userState {
  token: string,
  info: object,
  menu:Array<any>
}
const state = (): userState => ({
  token: '', // 登录token
  info: {},  // 用户信息
  menu:[]
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
    state.menu = menuList.menuList
  },
  infoChange(state: userState, info: object) {
    state.info = info
  }
}

// actions
const actions = {
  //登录
  login({ commit, dispatch }: ActionContext<userState, userState>, params: any) {
    return new Promise((resolve, reject) => {
      loginApi(params)
        .then((res) => {
          commit('tokenChange', res.data.accessToken)
          commit('infoChange', res.data)
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  //用户信息
  getInfo({ commit }: ActionContext<userState, userState>, params: any) {
    return new Promise((resolve, reject) => {
      getInfoApi()
        .then(res => {
          commit('infoChange', res.data)
          resolve(res.data)
        })
    })
  },

  //退出登录
  loginOut({ commit }: ActionContext<userState, userState>) {
    localStorage.clear()
    location.reload()
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}