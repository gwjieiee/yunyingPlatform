<template>
  <div class="layout-container">
    <div class="flex flex-between">
      <div class="flex center">
        <el-input class="m-r-5" placeholder="请输入搜索关键字" v-model="query.keyword" clearable @clear="clearInput"></el-input>
        <el-button type="primary" :icon="Search" @click="search_btn">搜索</el-button>
      </div>
      <div>
        <!-- <el-button type="primary" :icon="Plus" @click="add_btn">新增</el-button> -->
      </div>
    </div>
    <div class="m-t-10">
      <el-table :data="tableData.data" border>
        <el-table-column type="index" :index="indexMethod" align="center" label="序号" width="55"></el-table-column>
        <el-table-column label="产品线" prop="name"></el-table-column>
        <el-table-column label="项目"></el-table-column>
        <el-table-column label="项目名称" prop="remark"></el-table-column>
        <el-table-column label="1-30天"></el-table-column>
        <el-table-column label="31-60天" prop="remark"></el-table-column>
        <el-table-column label="61-90天"></el-table-column>
        <el-table-column label="91-180天" prop="remark"></el-table-column>
        <el-table-column label="半年以上"></el-table-column>
        <el-table-column label="总计" prop="remark"></el-table-column>
        <el-table-column label="金额合计"></el-table-column>
        <el-table-column label="发货日期"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <!-- <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button :icon="Edit" @click="edit_btn(scope.row)">编辑</el-button>
              <el-button type="primary" :icon="Setting" @click="security_btn(scope.row.id)">权限管理</el-button>
            </el-button-group>
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
  onMounted
} from "vue";

import {
  Search,
} from '@element-plus/icons'
import {
  getRoleList,
} from '@/api/system/role'

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

//获取列表
const getData = () => {
  getRoleList(query).then(res => {
    tableData.data = res.data.items
    tableData.totalCount = res.data.totalCount
    tableData.pageCount = res.data.totalPages
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

</script>

<style lang="scss" scoped>
.list {
  max-height: 400px;
  overflow-y: scroll;

  .list-item {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center
  }
}
</style>