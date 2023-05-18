import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/equipmentManage',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '设备管理',
      icon: 'sfont system-24gl-printer',
    },
    alwayShow: true,
    children: [
      {
        path: 'equipment',
        component: createNameComponent(
          () => import('@/views/main/equipmentManage/equipment/index.vue')
        ),
        meta: { title: '设备管理' },
      },
    ],
  },
]

export default route
