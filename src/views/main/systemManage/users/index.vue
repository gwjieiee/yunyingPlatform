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
        <el-table-column label="昵称" prop="nickname"></el-table-column>
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <!-- <el-switch v-model="scope.row.enabled" :inactive-icon="Close" :active-icon="Check" inline-prompt disabled>
            </el-switch> -->
            <el-tag v-if="scope.row.enabled" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="215">
          <template #default="scope">
            <el-button-group>
              <el-button type="primary" :icon="Edit" @click="edit_btn(scope.row)" plain>编辑</el-button>
              <el-button type="danger" :icon="Setting" @click="role_btn(scope.row.id)" plain>角色分配</el-button>
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
  <!-- 用户信息编辑，新增 -->
  <el-dialog v-model="editProp.show" :title="editProp.title" @close="cancel_btn">
    <el-form label-width="150px" ref="form" :model="editForm" :rules="rules">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="editForm.nickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input v-model="editForm.account" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="status"></el-switch>
      </el-form-item>
      <el-form-item label="密码" v-if="editProp.title == '新增'" prop="password">
        <el-input v-model="editForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" v-if="editProp.title == '新增'" prop="confirmPassword">
        <el-input v-model="editForm.confirmPassword" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="confirm_btn">确认</el-button>
        <el-button @click="cancel_btn">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 用户角色分配 -->
  <el-drawer size="800px" v-model="role.show" title="角色分配" @close="close_role">
    <div class="p-10">
      <el-space>
        <el-card style="width: 300px;">
          <template #header>
            <div class="card-header">
              <span>角色列表</span>
            </div>
          </template>
          <el-table :data="role.allData" height="400px" @selection-change="handleSelectLeft">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="角色名称" prop="name"></el-table-column>
          </el-table>
        </el-card>
        <div>
          <el-button :icon="ArrowRight" type="primary" @click="add_role"></el-button>
          <!-- <el-button :icon="ArrowLeft" type="primary" @click="del_role"></el-button> -->
        </div>
        <el-card style="width: 300px;">
          <template #header>
            <div class="card-header">
              <span>已拥有角色</span>
            </div>
          </template>
          <el-table :data="role.hasData" height="400px" @selection-change="handleSelectRight">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="角色名称" prop="name"></el-table-column>
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
  ArrowRight,
  ArrowLeft, Close, Check
} from '@element-plus/icons'
import {
  getUserList,
  postUser,
  putUser,
  delUser
} from '@/api/system/user'
import {
  getRoleList,
  allocateRole,
  getUserRole
} from '@/api/system/role'
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
  nickname: '',
  account: '',
  password: '',
  confirmPassword: ''
})
const tableData = reactive({
  data: [],
  totalCount: 0
})
const indexMethod = (index) => {
  return (query.PageIndex - 1) * query.PageSize + (index + 1)
}
const status = ref(true)
const form = ref()
const rules = reactive({
  nickname: [{
    required: true,
    message: '请输入昵称',
    trigger: 'blur'
  }, {
    min: 2,
    max: 16,
    message: '昵称长度需要在2-16个字符之间',
    trigger: 'blur'
  }],
  account: [{
    required: true,
    message: '请输入账号',
    trigger: 'blur'
  }, {
    min: 2,
    max: 32,
    message: '账号长度需要在2-32个字符之间',
    trigger: 'blur'
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  },
  {
    min: 5,
    max: 32,
    message: '密码长度需要在5-32个字符之间',
    trigger: 'blur'
  }
  ],
  confirmPassword: [{
    required: true,
    message: '请确认密码',
    trigger: 'blur'
  },
  {
    min: 5,
    max: 32,
    message: '密码长度需要在5-32个字符之间',
    trigger: 'blur'
  }
  ]
})

const loading = ref(false)

//获取角色列表
const getData = () => {
  loading.value = true
  getUserList(query).then(res => {
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
  editForm.nickname = val.nickname
  editForm.account = val.account
  editForm.id = val.id
  status.value = val.enabled
  editProp.title = '编辑'
  editProp.show = true
}
//新增
const add_btn = () => {
  editForm.nickname = ''
  editForm.account = ''
  editForm.password = ''
  editForm.confirmPassword = ''
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
        delete form.password
        delete form.confirmPassword
        updateUser(form)
      } else {
        delete form.id
        if (form.password === form.confirmPassword) {
          addUser(form)
        } else {
          ElMessage({
            type: 'error',
            message: '请确认密码是否输入一致'
          })
        }
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

//更新用户
const updateUser = (params) => {
  let id = params.id
  delete params.id
  putUser(id, params).then(res => {
    if (res.succeeded) {
      ElMessage({
        type: 'success',
        message: '用户信息编辑成功'
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
//新增用户
const addUser = (params) => {
  postUser(params).then(res => {
    if (res.succeeded) {
      ElMessage({
        type: 'success',
        message: '新增用户成功'
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
//删除用户
const del_btn = (id) => {
  ElMessageBox.confirm(
    '确认删除该用户？',
    '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }
  ).then(_ => {
    delUser(id).then(res => {
      if (res.succeeded) {
        ElMessage({
          type: 'success',
          message: '删除用户成功'
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
//角色分配相关
const role = reactive({
  show: false,
  allData: [],
  hasData: [],
  user: '',
  leftSelect: [],
  rightSelect: []
})
//获取所有角色，用户已有角色
const role_btn = (id) => {
  role.user = id
  let list = []
  getRoleList().then(res => {
    list = res.data.items
    // authority.allData = res.data
  }).then(_ => {
    getUserRole(id).then(res => {
      role.hasData = res.data
      let all = list.map(item => item.id)
      let has = res.data.map(item => item.id)
      let left = all.filter(item => has.indexOf(item) == -1)
      role.allData = left[0] ? list.filter(item => has.indexOf(item.id) == -1) : []
      role.show = true
    })
  })
}
const handleSelectLeft = (val) => {
  if (val[0]) {
    role.leftSelect = val.map(item => item.id)
  } else {
    role.leftSelect = []
  }
}
const handleSelectRight = (val) => {
  if (val[0]) {
    role.rightSelect = val.map(item => item.id)
  } else {
    role.rightSelect = []
  }
}
//添加权限
const add_role = () => {
  if (role.leftSelect[0]) {
    let has = role.hasData
    if (has[0]) {
      has = has.map(item => item.id)
      role.leftSelect = role.leftSelect.concat(has)
    }
    // console.log('add',role.leftSelect,role.hasData)
    allocateRole(role.user, role.leftSelect).then(res => {
      if (res.succeeded) {
        ElMessage({
          type: 'success',
          message: '角色分配成功！'
        })
        role_btn(role.user)
      }
    })
  } else {
    ElMessage({
      type: 'error',
      message: '请选择需要分配的角色！'
    })
  }
}
//删除权限
const del_role = () => {
  if (role.rightSelect[0]) {
    // console.log('del',authority.user,authority.rightSelect)
    // removeSecurity(role.user, role.rightSelect).then(res => {
    //   if (res.succeeded) {
    //     ElMessage({
    //       type: 'success',
    //       message: '权限删除成功！'
    //     })
    //     security_btn(authority.user)
    //   }
    // })
  } else {
    ElMessage({
      type: 'error',
      message: '请选择需要删除的角色！'
    })
  }
}
const close_role = () => {
  role.show = false
  role.allData = []
  role.hasData = []
  role.user = ''
  role.leftSelect = []
  role.rightSelect = []
}
</script>

<style lang="scss" scoped>

</style>