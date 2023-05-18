<template>
  <div class="chart">
    <chart :option="option"></chart>
  </div>
</template>
<script setup>
import chart from "@/components/charts/index.vue";
import { onMounted } from "vue";
//接收props传值
const props = defineProps({
  data: String,
});

//父子组件交互事件
// const emits = defineEmits(['update', 'change'])

onMounted(() => {
  // console.log("qqq", props.data);
});
const option = {
  title: {
    text: '2023研发费用达成趋势图',
    left: 'center',
    top: '2%'
  },
  grid: {
    top: '30%'
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    right: 0,
    top: '2%',
    selectedMode: false,
    orient: 'vertical',
  },
  xAxis: {
    type: "category",
    data: ["Q1", "Q2", "Q3", "Q4", "年度", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  },
  yAxis: [
    {
      type: "value",
      name:"2023预测（单位：万元）",
      axisLabel: {
        show: true,
        formatter: '{value} 万元'
      },
      position:'left',
      
    },
    {
      type: "value",
      name:"2023预测达成率（单位：%）",
      axisLabel: {
        show: true,
        formatter: '{value} %'
      },
      position:'right',
      
    }
  ],
  series: [
    {
      name: "2023年预测（实际+月滚动）B",
      type: "bar",
      data: [360, 360, 360,360,1440,120,120,120,120,120,120,120,120,120,120,120,120],
      tooltip: {
        valueFormatter: function (value) {
          return value + ' 万元';
        }
      },
      label:{
        //显示具体的数值
        show:true,
        position:'top',
        color:'',//默认为柱状图颜色
      }
      // barWidth:20,//柱状图宽度
    },
    {
      name: "2023年预测达成率（年初）B/A",
      type: "line",
      yAxisIndex: 1,//多个y轴必填
      data: [122, 112, 130, 123, 120, 145, 112, 117, 90, 80, 113, 120, 120, 120, 120, 120, 120],
      tooltip: {
        valueFormatter: function (value) {
          return value + ' %';
        }
      },
      label: {
        //显示具体的数值
        show: true,
        position: 'top',
        color:'#7caf64',
        formatter:'{c}%'
      }
      
    },
  ],
};
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 400px;
  // background: #fff;
  border-radius: 6px;
}
</style>
