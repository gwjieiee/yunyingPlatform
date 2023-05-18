import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/systemManage',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '系统管理',
      icon: 'sfont system-xitongzhuangtai',
    },
    alwayShow: true,
    children: [
      {
        path: 'security',
        component: createNameComponent(
          () => import('@/views/main/systemManage/security/index.vue')
        ),
        meta: { title: '权限管理' },
      },
      {
        path: 'role',
        component: createNameComponent(
          () => import('@/views/main/systemManage/role/index.vue')
        ),
        meta: { title: '角色管理' },
      },
      {
        path: 'user',
        component: createNameComponent(
          () => import('@/views/main/systemManage/users/index.vue')
        ),
        meta: { title: '用户管理' },
      },
    ],
  },
]

export default route