import request from '@/utils/system/request'

//获取设备清单
export function getEquipment(data:any) {
  return request({
    url: '/api/machine/machines',
    method: 'get',
    params: data,
  })
}

//获取设备详细信息
export function getEquipmentDetail(data:any){
  return request({
    url: '/api/machine/proj-by-sn/' + data,
    method: 'get',
  })
}

//添加设备
export function addEquipment(data:any) {
  return request({
    url: '/api/machine',
    method: 'post',
    data,
  })
}

//编辑设备
export function modEquipment(val:any,data:any) {
  return request({
    url: '/api/machine',
    method: 'put',
    params:val,
    data,
  })
}

//删除设备
export function delEquipment(data:any) {
  return request({
    url: '/api/machine',
    method: 'delete',
    params:data,
  })
}
