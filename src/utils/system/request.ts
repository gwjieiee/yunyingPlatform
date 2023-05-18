import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'

const service: AxiosInstance = axios.create({
  baseURL: '/api',//发布时需要注释
  timeout: 60 * 1000
})

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    //鉴权处理
    if (store.getters['user/token']) {
      config.headers['authorization'] = 'Bearer ' + store.state.user.token
    }
    return config
  },
  (error: AxiosError) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res.statusCode === 200) {
      return Promise.resolve(res)
    } else {
      showError(res)
      return Promise.reject(res)
    }
  },
  (error: AxiosError) => {
    showError(error)
    return Promise.reject(error)
  }
)

// 错误处理
function showError(error: any) {
  if (error.statusCode === 401) {
    // token过期，清除本地数据，并跳转至登录页面
    ElMessage({
      message: '登录过期，请重新登录',
      type: 'error',
      duration: 2 * 1000,
    })
    setTimeout(() => {
      store.dispatch('user/loginOut')
    }, 1500)
  }else if(error.statusCode === 403){
    // 无授权提示
    ElMessage({
      message: '当前用户暂无该api使用权限',
      type: 'error',
      duration: 2 * 1000,
    })
  }
   else {
    ElMessage({
      message: error.errors || '服务异常',
      type: 'error',
      duration: 3 * 1000
    })
  }

}

export default service