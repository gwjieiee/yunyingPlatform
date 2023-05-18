<template>
  <div class="layout-container">
    <div class="flex flex-between">
      <div class="flex center">
        <el-input class="m-r-5" placeholder="请输入搜索关键字" v-model="query.keyword" clearable @clear="clearInput"></el-input>
        <!-- <el-date-picker type="date" class="m-r-5" style="width:150px" v-model="query.date"
          placeholder="请选择日期"></el-date-picker> -->
        <el-date-picker type="daterange" class="m-r-5" style="width:220px" v-model="query.daterange"
          start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <!-- <el-cascader style="width:150px" class="m-r-5" v-model="value" :options="options" :props="props"
          @change="handleChange" :show-all-levels="false" clearable placeholder="级联选择"/> -->
        <el-select class="m-r-5" v-model="query.option" clearable placeholder="库存时长" style="width:150px">
          <el-option v-for="(item, index) in options" :label="item.label" :value="item.value"
            :key="'option' + index"></el-option>
        </el-select>
        <el-button type="primary" :icon="Search" @click="search_btn">搜索</el-button>
        <el-button type="danger" :icon="Delete" @click="clear_btn">清除搜索条件</el-button>
      </div>
      <div>
        <el-button type="primary" :icon="Sort" @click="sync_btn">同步库存数据</el-button>
      </div>
    </div>
    <div class="m-t-10">
      <el-table :data="tableData.data" border v-loading="loading">
        <el-table-column type="index" :index="indexMethod" align="center" label="序号" width="55"></el-table-column>
        <el-table-column label="产品线" prop="name" width="85"></el-table-column>
        <el-table-column label="物料编号" width="100">
          <template #default="scope">
            <span>310200064</span>
          </template>
        </el-table-column>
        <el-table-column label="物料名称" prop="name" width="100">
          <template #default="scope">
            <el-popover trigger="hover" v-if="scope.row.name.substr(4,6)">
              <template #reference>
                <span>{{ scope.row.name.substr(0,4) + '...' }}</span>
              </template>
              <template #default>
                <span>{{ scope.row.name }}</span>
              </template>
            </el-popover>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料描述" prop="remark" width="100">
        <template #default="scope">
          <el-popover trigger="hover" v-if="scope.row.remark.substr(4,6)">
            <template #reference>
              <span>{{ scope.row.remark.substr(0,4) + '...' }}</span>
            </template>
            <template #default>
              <span>{{ scope.row.remark }}</span>
            </template>
          </el-popover>
          <span v-else>{{ scope.row.remark }}</span>
        </template></el-table-column>
        <el-table-column label="库存单价(万)" prop="name" width="110"></el-table-column>
        <el-table-column label="期末库存金额(万)" prop="name" width="140"></el-table-column>
        <el-table-column label="入库时间" prop="name" width="100"></el-table-column>
        <el-table-column label="账龄天数" prop="name" width="100"></el-table-column>
        <el-table-column label="存储地点" prop="remark" width="100"></el-table-column>
        <el-table-column label="BG/BU" prop="name" width="100"></el-table-column>
        <el-table-column label="库存性质" prop="name" width="100"></el-table-column>
        <el-table-column label="库存来源" prop="name" width="100"></el-table-column>
        <el-table-column label="可用性" prop="name"></el-table-column>
        <el-table-column label="处理方案" prop="name" width="100"></el-table-column>
        <el-table-column label="运营负责人" prop="name" width="100"></el-table-column>
        <el-table-column label="计划负责人" prop="name" width="100"></el-table-column>
      </el-table>
      <el-pagination class="m-t-10" :current-page="query.PageIndex" :page-size="query.PageSize"
        :page-sizes="[10, 20, 30]" :disabled="disabled" :background="true" layout="total, sizes, prev, pager, next,"
        :total="tableData.totalCount" @size-change="pageSizeChange" @current-change="pageIndexChange" />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  computed
} from "vue";
import {
  useRouter,
  useRoute
} from 'vue-router'
import {
  ElMessage,
} from "element-plus";
import {
  Search,
  Delete,
  Sort,
} from '@element-plus/icons'

import { getStockData } from '@/api/inventory'

const route = useRoute()

const query = reactive({
  keyword: '',
  PageIndex: 1,
  PageSize: 10,
  option:''
})

const tableData = reactive({
  data: [],
  totalCount: 0
})

const indexMethod = (index) => {
  return (query.PageIndex - 1) * query.PageSize + (index + 1)
}

const props = {
  expandTrigger: 'hover',//次级菜单展开方式hover/click
  // multiple: true,//多选
  // checkStrictly: true,//选择任意一项
}
const options = [
  {
    value: '0-30天',
    label: '0-30天',
  },
  {
    value: '31-90天',
    label: '31-90天',
  },
  {
    value: '91-180天',
    label: '91-180天',
  },
  {
    value: '181-300天',
    label: '181-300天',
  },
  {
    value: '301-660天',
    label: '301-660天',
  },
  {
    value: '661天以上',
    label: '661天以上',
  },
]
const handleChange = (val) => {
  // let value = Object.prototype.toString
  // console.log('handle-change', value.call(val).slice(8, -1))
}

const loading = ref(false)

//获取库存明细列表
const getData = () => {
  loading.value = true
  getStockData(query).then(res => {
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

onBeforeMount(()=>{
  if(route.query.value){
    let value = route.query
    query.option = value.name
  }else{
    query.option = ''
  }
})

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

const clear_btn = () =>{
  query.PageIndex = 1
  query.PageSize = 10
  query.keyword = ''
  query.option = ''
  getData()
}

const sync_btn = () => {
  //
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 160px;
}

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