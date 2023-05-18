<template>
  <div class="container">
    <div class="box">
      <div class="box-left">

      </div>
      <div class="box-inner">
        <h1 class="center">运营平台</h1>
        <el-form class="form">
          <el-form-item>
            <el-input size="large" v-model="form.name" placeholder="账号" type="text" maxlength="50">
              <template #prepend>
                <i class="sfont system-xingmingyonghumingnicheng"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input size="large" ref="password" v-model="form.password" :type="passwordType" placeholder="密码"
              name="password" maxlength="50" @keyup.enter.native="submit">
              <template #prepend>
                <i class="sfont system-mima"></i>
              </template>
              <template #append>
                <i class="sfont password-icon" :class="passwordType ? 'system-yanjing-guan' : 'system-yanjing'"
                  @click="passwordTypeChange"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="form.loading" @click="submit"
              style="width: 100%;height:40px;color: #fff;">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive
} from 'vue'
import {
  useStore
} from 'vuex'
import {
  useRouter,
  useRoute
} from 'vue-router'
// import type { RouteLocationRaw  } from 'vue-router'
import {
  getAuthRoutes
} from '@/router/permission'
import {
  ElMessage
} from 'element-plus'
import selectLang from '@/layout/Header/functionList/word.vue'
export default defineComponent({
  components: {
    selectLang
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const form = reactive({
      name: '',
      password: '',
      loading: false,
    })
    const passwordType = ref('password')
    const passwordTypeChange = () => {
      passwordType.value === '' ? passwordType.value = 'password' : passwordType.value = ''
    }
    //账号密码是否为空
    const checkForm = () => {
      return new Promise((resolve, reject) => {
        if (form.name === '') {
          ElMessage.warning({
            message: '用户名不能为空',
            type: 'warning'
          });
          return;
        }
        if (form.password === '') {
          ElMessage.warning({
            message: '密码不能为空',
            type: 'warning'
          })
          return;
        }
        resolve(true)
      })
    }
    //登录
    const submit = () => {
      checkForm()
        .then(() => {
          form.loading = true
          let params = {
            account: form.name,
            password: form.password
          }
          store.dispatch('user/login', params)
            .then(() => {
              ElMessage.success({
                message: '登录成功',
                type: 'success',
                showClose: true,
                duration: 1000
              })
              location.reload()
            }).finally(() => {
              form.loading = false
            }).catch(err => {
              console.log(err)
            })
        })
    }
    return {
      form,
      passwordType,
      passwordTypeChange,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
@media screen and (min-width: 980px) {
  .container {
    width: 100vw;
    height: 100vh;
    background: whitesmoke url('@/assets/login/bg2.svg') no-repeat center;
    background-size: cover;
    display: flex;
    align-items: center;

    .box {
      width: 90%;
      height: 94%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 3% 2%;
      border-radius: 8px;
      background-color: #fffc;
      padding:0 3%;

      .box-left {
        width: 55%;
        height: 100%;
        background: url('@/assets/login/left.png') no-repeat center;
        background-size: contain;
      }

      .box-inner {
        width: 35%;
        background: #fff;
        box-shadow: 0 6px 20px 5px #9898981a, 0 16px 24px 2px #75757524;
        border-radius: 8px;
        padding: 40px 30px;
        h1 {
            font-size: 28px;
          }
        .form {
          width: 80%;
          margin: 50px auto 15px;

          .el-input {
            margin-bottom: 20px;
          }

          .password-icon {
            cursor: pointer;
            /* color: #409eff; */
          }
        }

        .fixed-top-right {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }
    }
  }
}

@media screen and (max-width: 980px) {

  .container .box {
    width: 100vw !important;
    height: 100vh;
    background: whitesmoke url('@/assets/login/bg2.svg') no-repeat center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container .box-inner {
    width: 65%;
    padding: 65px 40px;
    background: #fff;
    box-shadow: 0 6px 20px 5px #9898981a, 0 16px 24px 2px #75757524;
    border-radius: 8px;

    h1 {
      font-size: 25px;
    }

  }
}
</style>