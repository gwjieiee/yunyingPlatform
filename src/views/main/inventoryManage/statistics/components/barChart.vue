<template>
  <div class="chart">
    <chart :option="option" @choose="do_choose"></chart>
    <!-- <el-button @click="do_update">update</el-button>
    <el-button @click="do_change">change</el-button> -->
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
const emits = defineEmits(['update', 'change'])
const do_update = () => {
  emits('update', 'update-123')
}
const do_change = () => {
  emits('change', 'change-123')
}

const do_choose = (val) =>{
  console.log('choose-update',val)
}

onMounted(() => {
  // console.log("qqq", props.data);
});
const option = {
  title: {
    text: '折线图',
    left: '2%',
    top: '2%'
  },
  grid:{
    with:'60%',
    height:'60%',
    top:'30%'
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    right:0,
    top:'2%',
    selectedMode: false,
    orient: 'vertical',
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [ "2020", "2021", "2022",],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "原材料",
      type: "line",
      data: [128, 128, 267 ],
    },
    {
      name: "在制品",
      type: "line",
      data: [445, 339, 150],
    },
    {
      name: "成品",
      type: "line",
      data: [260, 260,200],
    },
    {
      name: "呆滞成品",
      type: "line",
      data: [30, 0, 0,],
    },
  ],
};
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 400px;
  background: #fff;
  border-radius: 6px;
}
</style>
