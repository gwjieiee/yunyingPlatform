/*
 * @Date: 2022-07-24 21:43:47
 * @Description:
 */
/** 引入类型 */
// import { Route } from './index.type'
/** 引入路由相关的资源 */
import router, { modules } from './index'
/** 引入vuex实例 */
import store from '@/store'
/** 引入需要权限的Modules */
import Dashboard from './modules/dashboard'
import SystemManage from './modules/systemManage'
import InventoryManage from './modules/inventoryManage'
import ExpensiveManage from './modules/expensiveManage'
import EquipmentManage from './modules/equipmentManage'

/** 登录后需要动态加入的本地路由 */
const asyncRoutes = [
  ...Dashboard,
  ...SystemManage,
  ...InventoryManage,
  ...ExpensiveManage,
  ...EquipmentManage,
]
/**
 * @name 动态路由的权限新增，供登录后调用
 * @other 如果需要进行后端接口控制菜单的话，请在此拿到后端的菜单树与asyncRoutes对比，生成一个新的值
 */
function addRoutes() {
  asyncRoutes.forEach((item) => {
    modules.push(item)
    router.addRoute(item)
  })
}

/**
 * @des 登录了之后会执行这个方法，实现动态路由的功能
 */
export function getAuthRoutes() {
  // 判断token是否存在，存在则调用添加路由的方法
  if (store.state.user.token) {
    addRoutes()
  }
}
