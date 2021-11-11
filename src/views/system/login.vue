<template>
  <div class="container">
    <div class="box">
      <div class="login-content-left">
        <img src="@/assets/login/left.jpg"/>
        <div class="login-content-left-mask">
          <div>{{ env.VITE_GLOB_APP_TITLE }}</div>
          <div>{{ env.VITE_GLOB_APP_SUB_TITLE || '' }}</div>
        </div>
      </div>

      <div class="box-inner">
        <h1>欢迎登录</h1>
        <el-form class="form">
          <el-input
              size="large"
              v-model="form.name"
              :placeholder="$t('message.system.userName')"
              type="text"
              maxlength="50"
          >
            <template #prepend>
              <i class="sfont system-xingmingyonghumingnicheng"></i>
            </template>
          </el-input>
          <el-input
              size="large"
              ref="password"
              v-model="form.password"
              :type="passwordType"
              :placeholder="$t('message.system.password')"
              name="password"
              maxlength="50"
          >
            <template #prepend>
              <i class="sfont system-mima"></i>
            </template>
            <template #append>
              <i class="sfont password-icon" :class="passwordType ? 'system-yanjing-guan': 'system-yanjing'"
                 @click="passwordTypeChange"></i>
            </template>
          </el-input>

          <el-form-item label="" v-if="env.VITE_GLOB_CAPTCHA_URL">
            <div style="display: flex">
              <el-input
                  size="large"
                  ref="password"
                  v-model="form.vercode"
                  :placeholder="$t('message.system.vercode')"
                  name="vercode"
                  maxlength="10"
              ></el-input>
              <img :src="env.VITE_GLOB_CAPTCHA_URL + captchaSuffix" @click="refreshCode" style="height: 40px" alt=""/>
              <el-button @click="refreshCode" type='text' class="hidden-xs-only" style="height: 40px">看不清，换一张</el-button>
            </div>
          </el-form-item>

          <el-button type="primary" :loading="form.loading" @click="submit" style="width: 100%;" size="medium">
            {{ $t('message.system.login') }}
          </el-button>
        </el-form>
        <div class="fixed-top-right">
          <select-lang/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, reactive} from 'vue'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'
import type {RouteLocationRaw} from 'vue-router'
import {addRoutes} from '@/router'
import {ElMessage} from 'element-plus'
import selectLang from '@/layout/Header/functionList/word.vue'
import {getEnv} from "@/config/env";

export default defineComponent({
  components: {
    selectLang
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const form = reactive({
      name: '',
      password: '',
      vercode: '',
      loading: false
    })
    const passwordType = ref('password')
    const passwordTypeChange = () => {
      passwordType.value === '' ? passwordType.value = 'password' : passwordType.value = ''
    }

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
    const submit = () => {
      checkForm().then(() => {
        form.loading = true
        let params = {
          name: form.name,
          password: form.password,
          vercode: form.vercode
        }
        store.dispatch('user/login', params).then(async () => {
          ElMessage.success({
            message: '登录成功',
            type: 'success',
            showClose: true,
            duration: 1000
          })
          await addRoutes()
          await router.push(route.query.redirect as RouteLocationRaw || '/')
        }).finally(() => {
          form.loading = false
        })
      })
    }

    // 获取env数据，刷新验证码
    const env = getEnv(), captchaSuffix = ref('');
    const refreshCode = () => {
      captchaSuffix.value = (env.VITE_GLOB_CAPTCHA_URL.indexOf("?") >= 0 ? "&__v=" : "?__v=") + new Date().getTime();
    }
    refreshCode();

    return {
      env, captchaSuffix,
      form,
      passwordType,
      passwordTypeChange,
      submit, refreshCode
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #fff url('./src/assets/login/bg.png') no-repeat center;
  overflow: hidden;
  background-size: cover;
  cursor: pointer;
  user-select: none;

  .box {
    width: 1160px;
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    background: white;
    border-radius: 8px;
    transform: translate(-50%, -50%);
    height: 440px;
    overflow: hidden;
    box-shadow: 0 6px 20px 5px rgba(152, 152, 152, 0.1),
    0 16px 24px 2px rgba(117, 117, 117, 0.14);

    .login-content-left {
      position: relative;

      img {
        height: 440px;
      }

      .login-content-left-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(rgba(0,204,222,0.8), rgba(51,132,224,0.8));
        text-align: center;
        color: #fff;
        font-size: 2rem;

        div:nth-child(1) {
          font-size: 4rem;
          margin-bottom: 1rem;
          margin-top: 10rem;
        }
      }
    }

    .box-inner {
      width: 500px;

      h1 {
        margin-top: 80px;
        text-align: center;
      }

      .form {
        width: 80%;
        margin: 50px auto 15px;

        .el-input {
          margin-bottom: 20px;
        }

        .password-icon {
          cursor: pointer;
          color: #409eff;
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

@media screen and (max-width: 1260px) {
  .login-content-left {
    display: none;
  }
  .box {
    width: 500px !important;
  }
}

@media screen and (max-width: 750px) {
  .container .box, .container .box-inner {
    width: 100vw !important;
    height: 100vh;
    box-shadow: none;
    left: 0;
    top: 0;
    transform: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
      margin-top: 0;
    }

    .form {
    }
  }
}
</style>
