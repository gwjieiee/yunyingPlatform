<template>
  <div class="expand-item">
    <block v-for="item in expandData.data" :key="item.budgetName">
      <div v-if="item.budgetName != '总计'">
        <label>{{ item.budgetName }}</label>
        <span>{{ item.q1 }}</span>
        <span>{{ item.q2 }}</span>
        <span>{{ item.q3 }}</span>
        <span>{{ item.q4 }}</span>
        <span>{{ item.total }}</span>
        <span>{{ item.jan }}</span>
        <span>{{ item.feb }}</span>
        <span>{{ item.mar }}</span>
        <span>{{ item.apr }}</span>
        <span>{{ item.may }}</span>
        <span>{{ item.jun }}</span>
        <span>{{ item.july }}</span>
        <span>{{ item.aug }}</span>
        <span>{{ item.sep }}</span>
        <span>{{ item.oct }}</span>
        <span>{{ item.nov }}</span>
        <span>{{ item.dec }}</span>
      </div>
    </block>
  </div>
</template>
<script setup>
import { onMounted, computed } from 'vue';
const expandData = defineProps({
  data: Object
})

onMounted(() => {

})


</script>
<style lang="scss" scoped>
.expand-item {
  div {
    margin: 10px 0;

    span {
      display: inline-block;
      width: 60px;
      text-align: center;
    }

    label {
      display: inline-block;
      width: 90px;
    }
  }
}

.expand-title span {
  font-weight: bold;
  color: #909399;
}

.gap {
  width: 100%;
  height: 10px;
}
</style>