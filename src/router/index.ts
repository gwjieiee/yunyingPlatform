import { reactive } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';
import NProgress from '@/utils/system/nprogress';
import { getInfoApi } from '@/api/user';
import { getAuthRoutes } from './permission';

NProgress.configure({ showSpinner: false });

import System from './modules/system';

let modules = reactive([...System]);

const router = createRouter({
	history: createWebHashHistory(),
	routes: modules
});

// 未授权时可访问的白名单
const whiteList = ['/login'];

// 路由跳转前的监听操作
router.beforeEach(async (to, _from, next) => {
	NProgress.start();
	if (store.state.user.token) {
		if (to.path === '/login') {
			next('/');
		} else {
			if (to.path === '/dashboard') {
				getInfoApi().then(res => {
					//token过期，重新登录
					if (!res.succeeded) {
						next('/login');
					}
				});
			}
			next()
		}
	} else if (whiteList.includes(to.path)) {
		next();
	} else {
		next('/login'); // 全部重定向到登录页
	}
});

// 路由跳转后的监听操作
router.afterEach((to, _from) => {
	NProgress.done();
});

export { modules };

export default router;
