interface Option<T>  {
  name: keyof optionKey<T>
  value: optionValue<T>
}

type optionKey<T> = {
  [name in keyof T]: string
}

type optionValue<T> = {
  value: T[keyof T]
}

export interface appState {
  isCollapse: boolean,
  contentFullScreen: boolean,
  showLogo: boolean,
  showTabs: boolean,
  expandOneMenu: boolean,
  elementSize: string,
  // lang: string,
  theme: {
    primaryColor: '#409eff',
  },
  menuList: Array<unknown>,
  [key:string]:unknown
}

const state = () => ({
  isCollapse: false, // 侧边栏是否收缩展示
  contentFullScreen: false, // 内容是否可全屏展示
  showLogo: true, // 是否显示Logo
  showTabs: true, // 是否显示导航历史
  expandOneMenu: false, // 一次是否只能展开一个菜单
  elementSize: 'default', // element默认尺寸，支持官网'large / default /small'小参数
  theme: {
    state: {
      style: 'light',
      primaryColor: '#409eff',
      menuType: 'side'
    }
  },
  menuList: []
})

// mutations
const mutations = {
  isCollapseChange(state: appState, type: boolean) {
    state.isCollapse = type
  },
  contentFullScreenChange(state: appState, type: boolean) {
    state.contentFullScreen = type
  },
  menuListChange(state: appState, arr: []) {
    state.menuList = arr
  },
  stateChange(state: appState, option: Option<appState>) {
    state[option.name] = option.value
  }
}

// actions
const actions = {}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
