import request from '@/utils/system/request'

// 权限列表
export function getSecurityList(data: object) {
  return request({
    url: '/api/security/list',
    method: 'get',
    params:data
  })
}

//所有权限列表
export function getSecurityAll() {
  return request({
    url: 'api/security/all',
    method: 'get',
  })
}

//获取角色权限
export function getRoleSecurity(data: any) {
  return request({
    url: '/api/role/' + data + '/securities',
    method: 'get',
  })
}

//分配角色权限
export function giveSecurity(id:any,data:any){
  return request({
    url: '/api/security/give/' + id,
    method: 'post',
    data,
  })
}

//取消角色权限
export function removeSecurity(id:any,data:any){
  return request({
    url: '/api/security/remove/' + id,
    method: 'delete',
    data,
  })
}

export function modSecurity(){
  return request({
    url:'',
    method:'put',
  })
}