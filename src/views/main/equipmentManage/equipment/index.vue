<template>
  <div class="layout-container">
    <div class="flex flex-between">
      <div class="flex center">
        <el-input class="m-r-5" style="width:160px" placeholder="请输入搜索关键字" v-model="query.keyword" clearable
          @clear="clearInput"></el-input>
        <el-select class="m-r-5" style="width:160px" v-model="query.projType" clearable @clear="clear_type"
          placeholder="请选择机台类型">
          <el-option v-for="item in typeList" :key="item.val" :label="item.label" :value="item.val"></el-option>
        </el-select>
        <el-button type="primary" :icon="Search" @click="search_btn">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" :icon="Plus" @click="add_btn">新增</el-button>
      </div>
    </div>
    <div class="m-t-10">
      <el-table :data="tableData.data" border v-loading="loading">
        <el-table-column type="expand" width="40">
          <template #default="props">
            <div class="expand-content">
              <expandItem :data="props.row.machineSN"></expandItem>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="客户端项目代号" prop="customerNo" width="125"></el-table-column>
        <el-table-column label="项目名称" prop="projName" width="200"></el-table-column>
        <el-table-column label="项目号" prop="projCode" width="150"></el-table-column>
        <el-table-column label="机台类型" width="85">
          <template #default="scope">
            <span v-if="scope.row.projType == '1'">新制</span>
            <span v-else>改造</span>
          </template>
        </el-table-column>
        <el-table-column label="整机料号" prop="matNo" width="130"></el-table-column>
        <el-table-column label="机台序列号" prop="machineSN" width="150"></el-table-column>
        <el-table-column label="出货时间" prop="deliverytime" width="100">
          <template #default="scope">
            {{ scope.row.deliverytime.split('T')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="出货现场" prop="deliveryAddr" width="100"></el-table-column>
        <el-table-column label="项目经理" prop="projManager" width="100"></el-table-column>
        <!-- <el-table-column label="项目金额" prop="projMoney"></el-table-column> -->
        <el-table-column label="操作" min-width="185" fixed="right">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" :icon="Edit" @click="edit_btn(scope.row)" plain>编辑</el-button>
              <el-button type="danger" :icon="Delete" @click="del_btn(scope.row)" plain>删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="m-t-10" :current-page="query.PageIndex" :page-size="query.PageSize"
        :page-sizes="[10, 20, 30]" :disabled="disabled" :background="true" layout="total, sizes, prev, pager, next,"
        :total="tableData.totalCount" @size-change="pageSizeChange" @current-change="pageIndexChange" />
    </div>
  </div>
  <!-- 新增、编辑 -->
  <el-drawer v-model="editProp.show" :title="editProp.title" @close="cancel_btn" size="600px">
    <el-form label-width="120px" ref="form" :model="editForm" :rules="rules" style="width:80%">
      <el-form-item label="客户端项目代码" prop="customerNo">
        <el-input v-model="editForm.customerNo" placeholder="客户端项目代码"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projName">
        <el-input v-model="editForm.projName" placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目号" prop="projCode">
        <el-input v-model="editForm.projCode" placeholder="项目号"></el-input>
      </el-form-item>
      <el-form-item label="机台类型" prop="projType">
        <el-radio-group v-model="editForm.projType">
          <el-radio :label="'1'">新制</el-radio>
          <el-radio :label="'2'">改造</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="editForm.projType == '2'" label="改造设备" prop="prevSN">
        <el-select style="width:100%" v-model="editForm.prevSN">
          <el-option v-for="item in tableData.data" :key="item.id" 
            :value="item.machineSN">{{ `${item.machineSN}( ${item.projName} )` }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="整机料号" prop="matNo">
        <el-input v-model="editForm.matNo" placeholder="整机料号"></el-input>
      </el-form-item>
      <el-form-item label="机台序列号" prop="machineSN">
        <el-input v-model="editForm.machineSN" placeholder="机台序列号"></el-input>
      </el-form-item>
      <el-form-item label="出货时间" prop="deliverytime">
        <el-date-picker style="width:100%" type="date" v-model="editForm.deliverytime"
          placeholder="出货时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="出货现场" prop="deliveryAddr">
        <el-input v-model="editForm.deliveryAddr" placeholder="出货现场"></el-input>
      </el-form-item>
      <el-form-item label="项目经理" prop="projManager">
        <el-select style="width:100%" v-model="editForm.projManager" filterable>
          <el-option v-for="item in editProp.userList" :label="item.nickname" :key="item.id"
            :value="item.nickname"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="项目金额" prop="projMoney">
        <el-input v-model="editForm.projMoney" placeholder="项目金额"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="danger" @click="confirm_btn">确认</el-button>
        <el-button @click="cancel_btn">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 详情 -->
  <el-drawer v-model="infoForm.show" size="900px" title="设备改造详情">
    <el-table :data="infoForm.data" border>
      <el-table-column label="客户端项目代号" prop="customerNo"></el-table-column>
      <el-table-column label="项目名称" prop="projName"></el-table-column>
      <el-table-column label="项目号" prop="projCode"></el-table-column>
      <el-table-column label="机台类型" width="85">
        <template #default="scope">
          <span v-if="scope.row.projType == '1'">新制</span>
          <span v-else>改造</span>
        </template>
      </el-table-column>
      <el-table-column label="整机料号" prop="matNo"></el-table-column>
      <el-table-column label="机台序列号" prop="machineSN"></el-table-column>
      <el-table-column label="出货时间" prop="deliverytime">
        <template #default="scope">
          {{ scope.row.deliverytime.split('T')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="出货现场" prop="deliveryAddr"></el-table-column>
      <el-table-column label="项目经理" prop="projManager"></el-table-column>
      <!-- <el-table-column label="项目金额" prop="projMoney"></el-table-column> -->
    </el-table>
  </el-drawer>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted
} from "vue";
import {
  ElMessage,
  ElMessageBox
} from "element-plus";
import {
  Plus,
  Delete,
  Search,
  Edit, InfoFilled
} from '@element-plus/icons'
import {
  getEquipment,
  getEquipmentDetail,
  addEquipment,
  modEquipment,
  delEquipment
} from '@/api/equipment'
import {
  getUserList,
} from '@/api/system/user'

import expandItem from "../components/expand-item.vue";

const typeList = [
  { label: '新制', val: '1' },
  { label: '改造', val: '2' }
]

const loading = ref(true)

const query = reactive({
  keyword: '',
  projType: '',
  PageIndex: 1,
  PageSize: 10
})
const editProp = reactive({
  show: false,
  title: '',
  userList: []
})

const rules = reactive({
  customerNo: [{
    required: true,
    message: '请输入客户端项目代码',
    trigger: 'blur'
  }],
  projCode: [{
    required: true,
    message: '请输入项目号',
    trigger: 'blur'
  }],
  projName: [{
    required: true,
    message: '请输入项目名称',
    trigger: 'blur'
  }],
  projType: [{
    required: true,
    message: '请选择机台类型',
    trigger: 'change'
  }],
  prevSN: [{
    required: true,
    message: '请选择改造来源',
    trigger: 'change'
  }],
  matNo: [{
    required: true,
    message: '请输入整机料号',
    trigger: 'blur'
  }],
  machineSN: [{
    required: true,
    message: '请输入机台序列号',
    trigger: 'blur'
  }],
  deliveryAddr: [{
    required: true,
    message: '请输入出货地址',
    trigger: 'blur'
  }],
  deliverytime: [{
    required: true,
    message: '请选择出货时间',
    trigger: 'blur'
  }],
  projManager: [{
    required: true,
    message: '请选择项目经理',
    trigger: 'blur'
  }],
  projMoney: [{
    required: true,
    message: '请输入项目金额',
    trigger: 'blur'
  }],
})

const editForm = reactive({})
const tableData = reactive({
  data: [],
  totalCount: 0
})
const indexMethod = (index) => {
  return (query.PageIndex - 1) * query.PageSize + (index + 1)
}

//获取角色列表
const getData = () => {
  loading.value = true
  getEquipment(query).then(res => {
    if (res.succeeded) {
      loading.value = false
      tableData.data = res.data.items
      tableData.totalCount = res.data.totalCount
      tableData.pageCount = res.data.totalPages
    } else {
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
  if (!query.keyword && !query.projType) {
    return;
  }
  getData()
}
const clearInput = () => {
  delete query.keyword
  getData()
}

const clear_type = () => {
  delete query.projType
  getData()
}

//编辑
const edit_btn = (val) => {
  editForm.id = val.id
  editForm.customerNo = val.customerNo
  editForm.projCode = val.projCode
  editForm.projName = val.projName
  editForm.projType = val.projType
  editForm.matNo = val.matNo
  editForm.machineSN = val.machineSN
  editForm.deliveryAddr = val.deliveryAddr
  editForm.deliverytime = val.deliverytime
  editForm.projManager = val.projManager
  // editForm.projMoney = val.projMoney
  editForm.prevSN = val.prevSN
  editProp.title = '编辑'
  get_userlist()
  editProp.show = true
}
//新增
const add_btn = () => {
  for (let key in editForm) {
    editForm[key] = ''
  }
  editProp.title = '新增'
  get_userlist()
  editProp.show = true
}

const get_userlist = () => {
  getUserList({
    PageIndex: 1,
    PageSize: 100
  }).then(res => {
    editProp.userList = res.data.items
  })
}

const form = ref()

//确认提交
const confirm_btn = () => {
  form.value.validate((valid) => {
    if (valid) {
      if (editProp.title == '编辑') {
        updateEquipment(editForm)
      } else {
        appendEquipment(editForm)
      }
    } else {
      console.error('error-submit')
    }
  })
}
//取消
const cancel_btn = () => {
  editProp.show = false
  editProp.title = ''
  for (let key in editForm) {
    editForm[key] = ''
  }
  form.value.resetFields()
}

//更新设备信息
const updateEquipment = (params) => {
  let val = {
    id: params.id
  }
  if (params.projType == '1') {
    delete params.prevSN
  }
  modEquipment(val, params).then(res => {
    if (res.succeeded) {
      ElMessage({
        type: 'success',
        message: '设备信息编辑成功'
      })
      cancel_btn()
      getData()
    } else {
      ElMessage({
        type: 'error',
        message: res.errors
      })
    }
  })
}
//新增设备
const appendEquipment = (params) => {
  delete params.id
  if (params.projType == '1') {
    delete params.prevSN
  }
  addEquipment(params).then(res => {
    if (res.succeeded) {
      ElMessage({
        type: 'success',
        message: '新增设备成功'
      })
      cancel_btn()
      getData()
    } else {
      ElMessage({
        type: 'error',
        message: res.errors
      })
    }
  })
}

//删除设备
const del_btn = (params) => {
  ElMessageBox.confirm(
    '确认删除该设备？',
    '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }
  ).then(_ => {
    delEquipment({
      id: params.id
    }).then(res => {
      if (res.succeeded) {
        ElMessage({
          type: 'success',
          message: '删除设备成功'
        })
        getData()
      } else {
        ElMessage({
          type: 'error',
          message: res.errors
        })
      }
    })
  }).catch(_ => {
    ElMessage({
      type: 'info',
      message: '已取消'
    })
  })
}

const infoForm = reactive({
  show: false,
  data: [],
  form: {}
})

//设备改造信息
const info_btn = (val) => {
  infoForm.form = val
  getEquipmentDetail(val.machineSN).then(res => {
    infoForm.data = res.data
    infoForm.show = true
  })
}

</script>

<style lang="scss" scoped>
.format-width {
  width: 220px;
}

.expand-content {
  padding-left: 96px;
}
</style>