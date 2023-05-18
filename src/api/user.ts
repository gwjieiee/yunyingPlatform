import request from '@/utils/system/request'

/** 登录api */
export function loginApi(data: object) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

/** 获取用户信息Api */
export function getInfoApi() {
  return request({
    url: '/api/user/profile',
    method: 'get'
  })
}

/** 修改密码 */
export function passwordChange(data: object) {
  return request({
    url: '/api/user/change-password',
    method: 'post',
    data
  })
}

/** 查看用户拥有权限 */
