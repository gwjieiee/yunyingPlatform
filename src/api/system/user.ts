import request from '@/utils/system/request'

// 用户列表
export function getUserList(data: object) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params:data
  })
}

// 新增用户
export function postUser(data: object) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}

// 编辑用户
export function putUser(id:any,data: object) {
  return request({
    url: '/api/user/' + id + '/modify',
    method: 'put',
    data
  })
}

// 删除用户
export function delUser(data: any) {
  return request({
    url: '/api/user?userids=' + data,
    method: 'delete',
  })
}