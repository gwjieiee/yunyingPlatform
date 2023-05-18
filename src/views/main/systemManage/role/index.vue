<template>
  <div class="layout-container">
    <div class="flex flex-between">
      <div class="flex center">
        <el-input class="m-r-5" placeholder="请输入搜索关键字" v-model="query.keyword" clearable @clear="clearInput"></el-input>
        <el-button type="primary" :icon="Search" @click="search_btn">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" :icon="Plus" @click="add_btn">新增</el-button>
      </div>
    </div>
    <div class="m-t-10">
      <el-table :data="tableData.data" border v-loading="loading">
        <el-table-column type="index" :index="indexMethod" align="center" label="序号" width="55"></el-table-column>
        <el-table-column label="角色" prop="name"></el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.enabled" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" fixed="right" width="215">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" :icon="Edit" @click="edit_btn(scope.row)" plain>编辑</el-button>
              <el-button type="danger" :icon="Setting" @click="security_btn(scope.row.id)" plain>权限管理</el-button>
              <!-- <el-button type="danger" :icon="Delete" @click="del_btn(scope.row.id)">删除</el-button> -->
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="m-t-10" :current-page="query.PageIndex" :page-size="query.PageSize"
        :page-sizes="[10, 20, 30]" :disabled="disabled" :background="true" layout="total, sizes, prev, pager, next,"
        :total="tableData.totalCount" @size-change="pageSizeChange" @current-change="pageIndexChange" />
    </div>
  </div>
  <!-- 新增，编辑角色 -->
  <el-dialog v-model="editProp.show" :title="editProp.title" @close="cancel_btn">
    <el-form label-width="150px" ref="form" :model="editForm" :rules="rules">
      <el-form-item label="角色" prop="name">
        <el-input v-model="editForm.name" placeholder="角色"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="editForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="status"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="confirm_btn">确认</el-button>
        <el-button @click="cancel_btn">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 角色分配权限 -->
  <el-drawer size="800px" v-model="authority.show" title="权限分配" @close="close_authority">
    <div class="p-10">
      <el-space>
        <el-card style="width: 300px;">
          <template #header>
            <div class="card-header">
              <span>未拥有权限</span>
            </div>
          </template>
          <el-table :data="authority.allData" height="400px" @selection-change="handleSelectLeft">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="权限名称" prop="uniqueName"></el-table-column>
          </el-table>
        </el-card>
        <div>
          <el-button :icon="ArrowRight" type="primary" @click="add_authority"></el-button>
          <el-button :icon="ArrowLeft" type="primary" @click="del_authority"></el-button>
        </div>
        <el-card style="width: 300px;">
          <template #header>
            <div class="card-header">
              <span>已有权限</span>
            </div>
          </template>
          <el-table :data="authority.hasData" height="400px" @selection-change="handleSelectRight">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="权限名称" prop="uniqueName"></el-table-column>
          </el-table>
        </el-card>
      </el-space>
    </div>
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
  Edit,
  Setting,
  Check,
  Close,
  ArrowRight,
  ArrowLeft
} from '@element-plus/icons'
import {
  getRoleList,
  postRole,
  putRole,
  delRole
} from '@/api/system/role'
import {
  getRoleSecurity,
  getSecurityAll,
  giveSecurity,
  removeSecurity
} from '@/api/system/security'
const query = reactive({
  keyword: '',
  PageIndex: 1,
  PageSize: 10
})
const editProp = reactive({
  show: false,
  title: ''
})
const editForm = reactive({
  name: '',
  remark: '',
})
const tableData = reactive({
  data: [],
  totalCount: 0
})
const indexMethod = (index) => {
  return (query.PageIndex - 1) * query.PageSize + (index + 1)
}
const status = ref(1)
const form = ref()
const rules = reactive({
  name: [{
    required: true,
    message: '请输入角色名',
    trigger: 'blur'
  }]
})

const loading = ref(false)

//获取角色列表
const getData = () => {
  loading.value = true
  getRoleList(query).then(res => {
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
  // console.log('pageIndex',val)
  query.PageIndex = val
  getData()
}
const pageSizeChange = (val) => {
  // console.log('pageSize',val)
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

//编辑
const edit_btn = (val) => {
  editForm.name = val.name
  editForm.remark = val.remark
  editForm.id = val.id
  status.value = val.enabled
  editProp.title = '编辑'
  editProp.show = true
}
//新增
const add_btn = () => {
  editForm.name = ''
  editForm.remark = ''
  editProp.title = '新增'
  editProp.show = true
}
//确认提交
const confirm_btn = () => {
  form.value.validate((valid) => {
    if (valid) {
      let form = editForm
      form.enabled = status.value
      if (editProp.title == '编辑') {
        updateRole(form)
      } else {
        delete form.id
        addRole(form)
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
  form.value.resetFields()
}

//更新角色
const updateRole = (params) => {
  let id = params.id
  delete params.id
  putRole(id, params).then(res => {
    if (res.succeeded) {
      ElMessage({
        type: 'success',
        message: '角色编辑成功'
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
//新增角色
const addRole = (params) => {
  postRole(params).then(res => {
    if (res.succeeded) {
      ElMessage({
        type: 'success',
        message: '新增角色成功'
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
//删除角色
const del_btn = (id) => {
  ElMessageBox.confirm(
    '确认删除该角色？',
    '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }
  ).then(_ => {
    delRole(id).then(res => {
      if (res.succeeded) {
        ElMessage({
          type: 'success',
          message: '删除角色成功'
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
const authority = reactive({
  show: false,
  allData: [],
  hasData: [],
  user: '',
  leftSelect: [],
  rightSelect: []
})
//获取所有权限，角色已有权限
const security_btn = (id) => {
  authority.user = id
  let list = []
  getSecurityAll().then(res => {
    list = res.data
    // authority.allData = res.data
  }).then(_ => {
    getRoleSecurity(id).then(res => {
      authority.hasData = res.data
      let all = list.map(item => item.id)
      let has = res.data.map(item => item.id)
      let left = all.filter(item => has.indexOf(item) == -1)
      authority.allData = left[0] ? list.filter(item => has.indexOf(item.id) == -1) : []
      authority.show = true
    })
  })
}
const handleSelectLeft = (val) => {
  if (val[0]) {
    authority.leftSelect = val.map(item => item.id)
  } else {
    authority.leftSelect = []
  }
}
const handleSelectRight = (val) => {
  if (val[0]) {
    authority.rightSelect = val.map(item => item.id)
  } else {
    authority.rightSelect = []
  }
}
//添加权限
const add_authority = () => {
  if (authority.leftSelect[0]) {
    let has = authority.hasData
    if (has[0]) {
      has = has.map(item => item.id)
      authority.leftSelect = authority.leftSelect.concat(has)
    }
    // console.log('add',authority.user,authority.leftSelect,authority.hasData)
    giveSecurity(authority.user, authority.leftSelect).then(res => {
      if (res.succeeded) {
        ElMessage({
          type: 'success',
          message: '权限分配成功！'
        })
        security_btn(authority.user)
      }
    })
  } else {
    ElMessage({
      type: 'error',
      message: '请选择需要添加的权限！'
    })
  }
}
//删除权限
const del_authority = () => {
  if (authority.rightSelect[0]) {
    // console.log('del',authority.user,authority.rightSelect)
    removeSecurity(authority.user, authority.rightSelect).then(res => {
      if (res.succeeded) {
        ElMessage({
          type: 'success',
          message: '权限删除成功！'
        })
        security_btn(authority.user)
      }
    })
  } else {
    ElMessage({
      type: 'error',
      message: '请选择需要删除的权限！'
    })
  }
}
const confirm_authority = () => {
  // security_btn(authority.user)
  if (authority.leftSelect[0]) {
    //
  } else {
    //
  }
}
const close_authority = () => {
  authority.show = false
  authority.allData = []
  authority.hasData = []
  authority.user = ''
  authority.leftSelect = []
  authority.rightSelect = []
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