<template>
  <div class="layout-container">
    <div class="flex flex-between">
      <div class="flex center">
        <span class="title">请选择年份</span>
        <el-date-picker type="year" class="m-r-5" v-model="query.year" :placeholder="year" format="YYYY"
          value-format="YYYY" @change="clear_year"></el-date-picker>
        <el-select v-model="query.type" class="m-r-5" placeholder="请选择查询类型">
          <el-option v-for="item in typeList" :value="item.label"></el-option>
        </el-select>
        <el-button type="primary" :icon="Search" @click="search_btn">搜索</el-button>
      </div>
      <div class="flex center">
        <!-- <el-button type="primary" :icon="Download" class="m-r-5" plain>导入模板</el-button>
            <el-upload class="flex center m-r-5">
              <el-button type="primary" :icon="Upload" plain>导入</el-button>
            </el-upload> -->
        <el-button type="primary" :icon="Plus" @click="add_btn">新增</el-button>
      </div>
    </div>
    <div class="m-t-10">
      <el-table :data="tableData.data" border v-loading="loading">
        <!-- <el-table-column type="index" :index="indexMethod" align="center" label="序号" width="55"></el-table-column> -->
        <el-table-column type="expand" width="40">
          <template #default="props">
            <div class="expand-content">
              <expandItem :data="props.row.details"></expandItem>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="研发费用(万元)" width="90" prop="name" align="center">
          <template #default="scope">
            {{ scope.row.year }}预测{{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column label="Q1" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].q1 }}
          </template>
        </el-table-column>
        <el-table-column label="Q2" prop="remark" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].q2 }}
          </template>
        </el-table-column>
        <el-table-column label="Q3" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].q3 }}
          </template>
        </el-table-column>
        <el-table-column label="Q4" prop="remark" width="60" align="center">
          <template #default="scope">
            {{ scope.row.details[0].q4 }}
          </template>
        </el-table-column>
        <el-table-column label="年度" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].total }}
          </template>
        </el-table-column>
        <el-table-column label="1月" prop="remark" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].jan }}
          </template>
        </el-table-column>
        <el-table-column label="2月" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].feb }}
          </template>
        </el-table-column>
        <el-table-column label="3月" prop="remark" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].mar }}
          </template>
        </el-table-column>
        <el-table-column label="4月" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].apr }}
          </template>
        </el-table-column>
        <el-table-column label="5月" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].may }}
          </template>
        </el-table-column>
        <el-table-column label="6月" prop="remark" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].jun }}
          </template>
        </el-table-column>
        <el-table-column label="7月" prop="remark" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].july }}
          </template>
        </el-table-column>
        <el-table-column label="8月" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].aug }}
          </template>
        </el-table-column>
        <el-table-column label="9月" prop="remark" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].sep }}
          </template>
        </el-table-column>
        <el-table-column label="10月" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].oct }}
          </template>
        </el-table-column>
        <el-table-column label="11月" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].nov }}
          </template>
        </el-table-column>
        <el-table-column label="12月" prop="remark" align="center" width="60">
          <template #default="scope">
            {{ scope.row.details[0].dec }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- <el-button-group>
                  <el-button type="primary" :disabled="scope.row.type == 'A'" :icon="Edit"
                    @click="edit_btn(scope.row)">编辑</el-button>
                </el-button-group> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination class="m-t-10" :current-page="query.PageIndex" :page-size="query.PageSize"
            :page-sizes="[10, 20, 30]" :disabled="disabled" :background="true" layout="total, sizes, prev, pager, next,"
            :total="tableData.totalCount" @size-change="pageSizeChange" @current-change="pageIndexChange" /> -->
    </div>
    <div class="m-t-50">
      <inventBarChart></inventBarChart>
    </div>
  </div>
  <!-- 编辑、新增 -->
  <el-drawer size="80%" v-model="editForm.editShow" :title="editForm.editTitle" @close="close_edit" :show-close="false"
    :close-on-click-modal="false">
    <el-form label-width="80px">
      <el-form-item label="预测年份">
        <el-date-picker v-model="editForm.data.year" type="year" placeholder="请选择预测年份" value-format="YYYY" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="editForm.data.type">
          <el-option v-for="item in typeList" :label="item.label" :key="'type-' + item.label"
            :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用数据">
        <el-table :data="editForm.data.details" border>
          <el-table-column label="" prop="budgetName" width="100"></el-table-column>
          <el-table-column label="1月" prop="remark" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.jan"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="2月" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.feb"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="3月" prop="remark" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.mar"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="4月" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.apr"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="5月" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.may"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="6月" prop="remark" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.jun"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="7月" prop="remark" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.july"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="8月" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.aug"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="9月" prop="remark" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.sep"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="10月" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.oct"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="11月" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.nov"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="12月" prop="remark" align="center" width="80">
            <template #default="scope">
              <el-input v-model="scope.row.dec"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="confirm_edit">确认</el-button>
        <el-button @click="cancel_edit">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import {
  reactive,
  onMounted,
  ref
} from "vue";
import {
  Search,
  Download,
  Upload,
  Plus,
  Edit
} from '@element-plus/icons'

import { getCost, addCost } from '@/api/cost'
import expandItem from '../components/expand-item.vue'
import inventBarChart from "../components/inventBarChart.vue";
import { ElMessage } from "element-plus";

let year = (new Date()).getFullYear()

const loading = ref(true)

const query = reactive({
  year: '',
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
  if (!query.year) {
    query.year = year
  }
  loading.value = true
  getCost(query.year).then(res => {
    tableData.data = res.data
    loading.value = false
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
  getData()
}

const clear_year = (val) => {
  if (!val) {
    getData()
  }
}

const typeList = reactive([
  { label: 'A' },
  { label: 'B' },
  { label: 'C' }
])

const editForm = reactive({
  editShow: false,
  editTitle: '',
  data: {
    year: '',
    type: '',
    details: [
      { budgetName: '自有人工费' },
      { budgetName: '外包人工费' },
      { budgetName: '研发下沉' },
      { budgetName: '差旅费用' },
      { budgetName: '材料费' }
    ]
  }
})

const add_btn = () => {
  editForm.editShow = true
  editForm.editTitle = '新增'
}

const edit_btn = () => {
  editForm.editShow = true
  editForm.editTitle = '编辑'
}

const cancel_edit = () => {
  editForm.editShow = false
  editForm.data.year = ''
  editForm.data.type = ''
  editForm.data.details = [
    { budgetName: '自有人工费' },
    { budgetName: '外包人工费' },
    { budgetName: '研发下沉' },
    { budgetName: '差旅费用' },
    { budgetName: '材料费' }
  ]
}

const confirm_edit = () => {
  if (!editForm.data.year) {
    ElMessage.error('请选择预测年份！')
    return;
  }
  if (!editForm.data.type) {
    ElMessage.error('请选择类型！')
    return;
  }
  let data = editForm.data.details
  for (let i = 0; i < data.length; i++) {
    if (Object.getOwnPropertyNames(data[i]).length < 13) {
      ElMessage.error('请将费用信息填写完整！')
      return;
    }
  }
  addCost(editForm.data).then(res => {
    if (res.succeeded) {
      ElMessage.success('费用数据添加成功！')
      cancel_edit()
    } else {
      ElMessage.error(res.errors)
    }
  })
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

.expand-content {
  padding-left: 40px;
}

.title {
  font-size: 14px;
  color: #606266;
  padding-right: 5px;
}
</style>