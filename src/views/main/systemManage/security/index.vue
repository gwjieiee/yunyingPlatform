<template>
  <div class="layout-container">
    <div class="flex flex-between">
      <div class="flex center">
        <el-input class="m-r-5" placeholder="请输入搜索关键字" v-model="query.keyword" clearable @clear="clearInput"></el-input>
        <el-button type="primary" :icon="Search" @click="search_btn">搜索</el-button>
      </div>
      <div>
        
      </div>
    </div>
    <div class="m-t-10">
      <el-table :data="tableData.data" border v-loading="loading">
        <el-table-column type="index" :index="indexMethod" align="center" label="序号" width="55"></el-table-column>
        <el-table-column label="权限名称" prop="uniqueName"></el-table-column>
        <el-table-column label="备注" prop="remark">
        <template #default="scope">
          <el-input v-model="scope.row.remark" @keydown="updateRemark(scope.row,$event)"></el-input>
        </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <span v-if="scope.row.enabled">已启用</span>
            <span v-else>已禁止</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template #default="scope">
            <el-button :icon="Edit" @click="edit_btn(scope.row)">编辑</el-button>
            <el-button type="danger" :icon="Delete" @click="del_btn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination class="m-t-10" :current-page="query.PageIndex" :page-size="query.PageSize"
        :page-sizes="[10, 20, 30]" :disabled="disabled" :background="true" layout="total, sizes, prev, pager, next,"
        :total="tableData.totalCount" @size-change="pageSizeChange" @current-change="pageIndexChange" />
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  onMounted,
  ref
} from "vue"

import {
  ElMessage,
} from "element-plus"

import {
  Search,
} from '@element-plus/icons'

import {
  getSecurityList,
} from '@/api/system/security'

const query = reactive({
  keyword: '',
  PageIndex: 1,
  PageSize: 10
})

const tableData = reactive({
  data: [],
  totalCount: 0
})
const indexMethod = (index) => {
  return (query.PageIndex - 1) * query.PageSize + (index + 1)
}

const loading = ref(false)

//获取角色列表
const getData = () => {
  loading.value = true
  getSecurityList(query).then(res => {
    if(res.succeeded){
      loading.value = false
      tableData.data = res.data.items
      tableData.totalCount = res.data.totalCount
      tableData.pageCount = res.data.totalPages
    }else{
      ElMessage.error(res.errors)
    }
  })
}
onMounted(() => {
  getData()
})

const pageIndexChange = (val) => {
  query.PageIndex = val
  getData()
}
const pageSizeChange = (val) => {
  query.PageSize = val
  getData()
}
const search_btn = () => {
  if (!query.keyword) {
    return;
  }
  getData()
}
const clearInput = () => {
  getData()
}

const updateRemark = (val,e)=>{
  if(e.code == 'Enter'){
    putUser
    console.log(e.target.value,val)
  }
}

</script>

<style lang="scss" scoped>

</style>