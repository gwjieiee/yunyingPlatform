import request from '@/utils/system/request'


//获取预算数据
export function getCost(year:Number){
  return request({
    url:'/api/cost/getbudget/' + year,
    method:'get',
    // params:data
  })
}

//添加预算数据
export function addCost(data:any){
  return request({
    url:'/api/cost/insertbudget',
    method:'post',
    data
  })
}

//获取预算统计
export function getCostStatistics(data:any){
  return request({
    url:'',
    method:'get',
    params:data
  })
}