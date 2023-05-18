import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/inventoryManage',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '库存管理',
      icon: 'sfont system-xitongzhuangtai',
    },
    alwayShow: true,
    children: [
      {
        path: 'statistics',
        component: createNameComponent(
          () => import('@/views/main/inventoryManage/statistics/index.vue')
        ),
        meta: { title: '库存统计' },
      },
      {
        path: 'inventory',
        component: createNameComponent(
          () => import('@/views/main/inventoryManage/inventory/index.vue')
        ),
        meta: { title: '库存明细' },
      },
      {
        path: 'block',
        component: createNameComponent(
          () => import('@/views/main/inventoryManage/block/index.vue')
        ),
        meta: { title: '呆滞成品' },
      },
      {
        path: 'processing',
        component: createNameComponent(
          () => import('@/views/main/inventoryManage/processing/index.vue')
        ),
        meta: { title: '在制成品' },
      },
    ],
  },
]

export default route