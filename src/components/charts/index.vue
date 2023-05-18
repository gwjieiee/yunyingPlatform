<template>
  <div ref="chart" class="chart" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// import type { Ref } from 'vue'
import * as echarts from 'echarts'
import { useEventListener } from '@vueuse/core'
import {
  useRouter,
  useRoute
} from 'vue-router'
// import { pa } from 'element-plus/lib/locale'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  option: Object
})

const emit = defineEmits(['choose'])

const chart = ref(null)
// 在onMounted事件才能拿到真实dom
onMounted(() => {
  const dom = chart.value
  if (dom) {
    let option = props.option
    // 需要在页面Dom元素加载后再初始化echarts对象
    let myChart = echarts.init(dom)
    myChart.setOption(option)
    // 自动监听加自动销毁
    useEventListener('resize', () => myChart.resize())

    myChart.on('click',(params)=>{
      if (params.seriesType == 'pie'){
        emit('choose',params.data)
      }
    })

    watch(() => props.option, (newVal) => {
      myChart.setOption(newVal)
    },{ deep: true })
  }
})
</script>

<style lang="scss" scoped>
  .chart {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
</style>