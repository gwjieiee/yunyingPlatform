<template>
  <div class="tabs">
    <el-scrollbar
      class="scroll-container tags-view-container"
      ref="scrollbarDom"
      @wheel.passive="handleWhellScroll"
      @scroll="handleScroll"
    >
      <Item
        v-for="menu in menuList"
        :key="menu.meta.title"
        :menu="menu"
        :active="activeMenu.path === menu.path"
        @close="delMenu(menu)"
        @reload="pageReload"
      />
    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent, computed, reactive, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

/** 引用图标 */
import {RefreshLeft, CircleClose} from '@element-plus/icons'

import Item from './item.vue'

export default defineComponent({
  components: {
    Item
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const scrollbarDom = ref(null)
    const scrollLeft = ref(0)
    const defaultMenu = {
      path: '/dashboard',
      meta: { title: 'message.menu.dashboard.index', hideClose: true }
    }
    const currentDisabled = computed(() => route.path === defaultMenu.path)

    let activeMenu = reactive({ path: '' })
    let menuList = ref([])
    if (menuList.value.length === 0) { // 判断之前有没有调用过
      addMenu(defaultMenu)
    }
    
    router.afterEach(() => {
      addMenu(route)
      initMenu(route)
    })

    // 当前页面组件重新加载
    function pageReload() {
      const self = route.matched[route.matched.length-1].instances.default

      self.handleReload();
    }

    // 关闭当前标签，首页不关闭
    function closeCurrentRoute() {
      if (route.path !== defaultMenu.path) {
        delMenu(route)
      }
    }
    // 关闭除了当前标签之外的所有标签
    function closeOtherRoute() {
      menuList.value = [defaultMenu]
      if (route.path !== defaultMenu.path) {
        addMenu(route)
      }
      setKeepAliveData()
    }

    // 关闭所有的标签，除了首页
    function closeAllRoute() {
      menuList.value = [defaultMenu]
      setKeepAliveData()
      router.push(defaultMenu.path)
    }

    // 添加新的菜单项
    function addMenu(menu) {
      let { path, meta, name } = menu
      if (meta.hideTabs) {
        return
      }
      let hasMenu = menuList.value.some((obj) => {
        return obj.path === path
      })
      if (!hasMenu) {
        menuList.value.push({
          path,
          meta,
          name
        })
      }
    }

    // 删除菜单项
    function delMenu(menu) {
      let index = 0
      if (!menu.meta.hideClose) {
        if (menu.meta.cache && menu.name) {
          store.commit('keepAlive/delKeepAliveComponentsName', menu.name)
        }
        index = menuList.value.findIndex((item) => item.path === menu.path)
        menuList.value.splice(index, 1)
      }
      if (menu.path === activeMenu.path) {
        index - 1 > 0 ? router.push(menuList.value[index - 1].path) : router.push(defaultMenu.path)
      }
    }

    // 初始化activeMenu
    function initMenu(menu) {
      activeMenu = menu
      nextTick(() => {
        setPosition()
      })
    }
    /** 设置当前滚动条应该在的位置 */
    function setPosition() {
      if (scrollbarDom.value) {
        const domBox = {
          scrollbar: scrollbarDom.value.scrollbar$.querySelector('.el-scrollbar__wrap '),
          activeDom: scrollbarDom.value.scrollbar$.querySelector('.active'),
          activeFather: scrollbarDom.value.scrollbar$.querySelector('.el-scrollbar__view')
        }
        let hasDoms = true
        Object.keys(domBox).forEach((dom) => {
          if (!dom) {
            hasDoms = false
          }
        })
        if (!hasDoms) {
          return
        }
        const domData = {
          scrollbar: domBox.scrollbar.getBoundingClientRect(),
          activeDom: domBox.activeDom.getBoundingClientRect(),
          activeFather: domBox.activeFather.getBoundingClientRect()
        }
        const num = domData.activeDom.x - domData.activeFather.x + 1/2 * domData.activeDom.width - 1/2 * domData.scrollbar.width
        domBox.scrollbar.scrollLeft = num
      }
    }

    // 配置需要缓存的数据
    function setKeepAliveData() {
      let keepAliveNames = []
      menuList.value.forEach((menu) => {
        menu.meta && menu.meta.cache && menu.name && keepAliveNames.push(menu.name)
      })
      store.commit('keepAlive/setKeepAliveComponentsName', keepAliveNames)
    }

    /** 监听鼠标滚动事件 */
    function handleWhellScroll(e) {
      let distance = 0
      let speed = 5
      if (e.wheelDelta > 30) {
        distance = -10
      } else if (e.wheelDelta < -30) {
        distance = 10
      }
      // console.log(scrollLeft.value + eventDelta / 4)
      scrollbarDom.value?.setScrollLeft(scrollLeft.value + distance * speed)
    }

    /** 监听滚动事件 */
    function handleScroll({ scrollLeft: left }) {
      scrollLeft.value = left
    }

    // 初始化时调用：1. 新增菜单 2. 初始化activeMenu
    addMenu(route)
    initMenu(route)
    return {
      RefreshLeft, CircleClose,
      scrollbarDom,
      // 菜单相关
      menuList,
      activeMenu,
      currentDisabled,
      pageReload,
      delMenu,
      closeCurrentRoute,
      closeOtherRoute,
      closeAllRoute,
      handleScroll,
      handleWhellScroll
    }
  }
})
</script>

<style lang="scss" scoped>
  .tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background: var(--system-header-background);
    border-bottom: 1px solid var(--system-header-border-color);
    border-top: 1px solid var(--system-header-border-color);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .1);
    .handle {
      min-width: 95px;
      height: 100%;
      display: flex;
      align-items: center;
      .el-dropdown-link {
        margin-top: 5px;
        border-left: 1px solid var(--system-header-border-color);
        height: 25px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      i {
        color: var(--system-header-text-color);
      }
    }
  }
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    :deep(.el-scrollbar__bar) {
      bottom: 0px;
    }
    :deep(.el-scrollbar__wrap) {
      height: 49px;
    }
  }
  .tags-view-container {
    height: 34px;
    flex: 1;
    width: 100%;
    display: flex;
  }
  .el-icon-full-screen {
    cursor: pointer;
    &:hover {
      background: rgba(0,0,0,.025);
    }
    &:focus {
      outline: none;
    }
  }
  .tab-ddropdown-item {
    display: flex;
    align-items: center;
  }
</style>
