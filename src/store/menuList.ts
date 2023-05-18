const menuList = [
  {
    path: '/',
    meta: {
      title: '首页',
      icon: 'sfont system-home',
    },
    children: [
      {
        path: 'dashboard',
        meta: {
          title: '首页',
          icon: 'sfont system-home',
        },
      },
    ],
  },
  {
    path: '/systemManage',
    meta: {
      title: '系统管理',
      icon: 'sfont system-xitongzhuangtai',
    },
    children: [
      {
        path: 'user',
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'security',
        meta: {
          title: '权限管理',
        },
      },
      {
        path: 'role',
        meta: {
          title: '角色管理',
        },
      },
    ],
  },
  {
    path: '/inventoryManage',
    meta: {
      title: '库存管理',
      icon: 'sfont system-menu',
    },
    children: [
      {
        path: 'statistics',
        meta: {
          title: '库存统计',
        },
      },
      {
        path: 'inventory',
        meta: {
          title: '库存明细',
        },
      },
      {
        path: 'processing',
        meta: {
          title: '在制成品',
        },
      },
      {
        path: 'block',
        meta: {
          title: '呆滞成品',
        },
      },
    ],
  },
  {
    path: '/expensiveManage',
    meta: {
      title: '费用管理',
      icon: 'sfont system-jindutiaoshouyidaozhang',
    },
    children: [
      {
        path: 'invent',
        meta: {
          title: '研发费用',
        },
      },
      {
        path: 'service',
        meta: {
          title: '客服费用',
        },
      },
    ],
  },
  {
    path: '/equipmentManage',
    meta: {
      title: '设备管理',
      icon: 'sfont system-24gl-printer',
    },
    children: [
      {
        path: 'equipment',
        meta: {
          title: '设备管理',
        },
      },
    ],
  },
]
export default {
  menuList,
}
