import request from '@/utils/system/request'

// 角色列表
export function getRoleList(data: any) {
  return request({
    url: '/api/role/list',
    method: 'get',
    params: data,
  })
}

// 新增角色
export function postRole(data: object) {
  return request({
    url: '/api/role/add',
    method: 'post',
    data,
  })
}

//分配角色
export function allocateRole(id: any, data: object) {
  return request({
    url: '/api/role/give/' + id,
    method: 'post',
    data,
  })
}

//获取用户拥有的角色
export function getUserRole(data:any){
  return request({
    url: '/api/user/' + data + '/roles',
    method: 'get',
  })
}

// 编辑角色
export function putRole(id: any, data: object) {
  return request({
    url: '/api/role/' + id + '/modify',
    method: 'post',
    data,
  })
}

// 删除角色
export function delRole(data: any) {
  return request({
    url: '/api/role?roleids=' + data,
    method: 'delete',
  })
}


