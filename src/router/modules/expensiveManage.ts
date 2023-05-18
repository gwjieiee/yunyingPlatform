import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/expensiveManage',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '费用管理',
      icon: 'sfont system-jindutiaoshouyidaozhang',
    },
    alwayShow: true,
    children: [
      {
        path: 'invent',
        component: createNameComponent(
          () => import('@/views/main/expensiveManage/invent/index.vue')
        ),
        meta: { title: '研发费用' },
      },
      {
        path: 'service',
        component: createNameComponent(
          () => import('@/views/main/expensiveManage/service/index.vue')
        ),
        meta: { title: '客服费用' },
      },
    ],
  },
]

export default route