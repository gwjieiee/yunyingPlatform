<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right:30px;">
      <el-form-item label="原密码：" prop="old">
        <el-input type="password" v-model="form.old" placeholder="请输入原密码" show-password></el-input>
      </el-form-item>
			<el-form-item label="新密码：" prop="new">
			  <el-input type="password" v-model="form.new" placeholder="请输入新密码" show-password></el-input>
			</el-form-item>
      <el-form-item label="确认新密码：" prop="confirm">
        <el-input type="password" v-model="form.confirm" placeholder="请确认新密码" show-password></el-input>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { passwordChange } from '@/api/user'
import Layer from '@/components/layer/index.vue'
export default defineComponent({
  components: {
    Layer
  },
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: true
        }
      }
    }
  },
  setup(props, ctx) {
    const ruleForm = ref(null)
    const layerDom = ref(null)
    const store = useStore()
    let form = ref({
      old: '',
      new: '',
      confirm:''
    })
    const rules = {
      old: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
      new: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
      confirm: [{ required: true, message: '请确认新密码', trigger: 'blur' }],
    }
    function submit() {
      if (ruleForm.value) {
        ruleForm.value.validate((valid) => {
          if (valid) {
            if(form.value.new != form.value.confirm){
              ElMessage({
                type:'error',
                message:'请确认新密码是否输入一致'
              })
              return;
            }
            let params = {
              oldPassword: form.value.old,
              password: form.value.new,
              confirmPassword: form.value.confirm
            }
            // console.log('change-form',params)
            passwordChange(params).then(res=>{
              if (res.succeeded) {
                ElMessage({
                  type: 'success',
                  message: '密码修改成功，即将跳转到登录页面'
                })
                layerDom.value && layerDom.value.close()
                setTimeout(() => {
                  store.dispatch('user/loginOut')
                }, 2000)
              } else {
                ElMessage({
                  type:'error',
                  message: res.errors
                })
              }
            })
          } else {
            return false;
          }
        });
      }
    }
    return {
      form,
      rules,
      layerDom,
      ruleForm,
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
  
</style>