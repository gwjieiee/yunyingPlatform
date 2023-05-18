<template>
  <div class="chart">
    <chart :option="option" @choose="do_choose"></chart>
  </div>
</template>
<script setup>
import chart from '@/components/charts/index.vue'
const option = {
  title: {
    text: '饼图',
    left: '2%',
    top: '2%'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top:'2%',
    right:0,
    selectedMode: false,
    orient: 'vertical',
  },
  series: [
    {
      type: 'pie',
      // radius: ['40%', '70%'],圆环
      radius:'50%',
      center:['45%','55%'],//调整位置
      avoidLabelOverlap: false,
      itemStyle: {
        // borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        // position: 'center'
      },
      emphasis: {
        //高亮状态的扇区和标签样式
        label: {
          show: true,
          // fontSize: 20,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.6)'
        }
      },
      labelLine: {
        show: true
      },
      data: [
        { value: 1048, name: '0-30天' },
        { value: 735, name: '31-90天' },
        { value: 580, name: '91-180天' },
        { value: 484, name: '181-300天' },
        { value: 300, name: '301-660天' },
        { value: 400, name: '661天以上'}
      ]
    }
  ]
}

const emit = defineEmits(['choose'])

const do_choose = (val) =>{
  // console.log('do-choose',val)
  emit('choose',val)
}

</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 400px;
  background: #fff;
  border-radius: 6px;
}
</style>