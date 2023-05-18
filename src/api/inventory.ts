import request from '@/utils/system/request'

//获取库存明细
export function getStockData(data:any){
  return request({
    url: '/api/stock/list',
    method: 'get',
    params: data,
  })
}