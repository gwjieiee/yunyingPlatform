<template>
  <div class="expand-main" v-loading="loading">
    <!-- <el-table :data="tableData.data">
      <el-table-column label="客户端项目代号" prop="customerNo"></el-table-column>
      <el-table-column label="项目名称" prop="projName"></el-table-column>
      <el-table-column label="项目号" prop="projCode"></el-table-column>
      <el-table-column label="整机料号" prop="matNo"></el-table-column>
      <el-table-column label="机台序列号" prop="machineSN"></el-table-column>
      <el-table-column label="出货时间" prop="deliverytime">
        <template #default="scope">
          {{ scope.row.deliverytime.split('T')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="出货现场" prop="deliveryAddr"></el-table-column>
      <el-table-column label="项目经理" prop="projManager"></el-table-column>
      <el-table-column label="项目金额" prop="projMoney"></el-table-column>
    </el-table> -->
    <div class="expand-item" v-for="item in tableData.data" :key="item.id">
      <div style="width:125px">{{ item.customerNo }}</div>
      <div style="width: 200px;">{{ item.projName }}</div>
      <div style="width: 150px;">{{ item.projCode }}</div>
      <div style="width:85px" v-if="item.projType == '1'">新制</div>
      <div style="width:85px" v-else>改造</div>
      <div style="width:130px">{{ item.matNo }}</div>
      <div style="width: 150px;">{{ item.machineSN }}</div>
      <div>{{ item.deliverytime.split('T')[0] }}</div>
      <div>{{ item.deliveryAddr }}</div>
      <div>{{ item.projManager }}</div>
    </div>
  </div>
</template>
<script setup>
import { getEquipmentDetail } from '@/api/equipment';
import { onMounted, computed, reactive,ref } from 'vue';
const expandData = defineProps({
  data: Object
})

const loading = ref(false)

const tableData = reactive({
  data: []
})

onMounted(() => {
  getDetail()
})

const getDetail = () => {
  loading.value = true
  getEquipmentDetail(expandData.data).then(res => {
    if (res.succeeded){
      loading.value = false
      tableData.data = res.data
      if (tableData.data.length > 1) {
        tableData.data.splice(0, 1)
      }
    }
  })
}

</script>
<style lang="scss" scoped>
.expand-main{
  display: table;
  .expand-item {
      width: 100%;
      height: auto;
      // border-bottom: 1px solid #ebeef5;
      display: table-row;
      align-items: center;
  
      div {
        display: table-cell;
        width: 100px;
        padding: 15px 12px;
      }
    }
}
</style>