/**
 * v-debounce
 * 按钮防抖指令
 * 接收参数：function类型
 */
import type { Directive, DirectiveBinding } from 'vue'
interface ElType extends HTMLElement {
  __handleClick__: any
}
const vDebounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') {
      console.error('callback must be a function')
      return;
    }
    let timer: NodeJS.Timeout|null = null
    el.__handleClick__ = function(e: ElType) {
      if (timer) {
        clearInterval(timer)
      }
      timer = setTimeout(() => {
        binding.value()
      }, 2000)
    }
    el.addEventListener('click', el.__handleClick__)
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  }
}

export default vDebounce