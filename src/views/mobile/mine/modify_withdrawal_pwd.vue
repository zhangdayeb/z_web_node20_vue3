<template>
  <div class="m-login-pwd">
    <van-nav-bar
      left-arrow
      :title="
        isModify === false
          ? $t('mine.settingWithdrawalPwd')
          : $t('mine.modifyWithdrawalPwd')
      "
      @click-left="onClickLeft"
    />

    <van-form @submit="onSubmit" class="m-frm">
      <template v-if="isModify">
        <van-field
          v-model="frm.oldPassword"
          autocomplete="current-password"
          type="password"
          :name="$t('mine.currPwd')"
          :label="$t('mine.currPwd')"
          :placeholder="$t('mine.currPwd')"
          :rules="[{ required: true, message: $t('mine.inputCurrPwd') }]"
        />
        <van-field
          v-model="frm.password"
          autocomplete="new-password"
          type="password"
          :name="$t('mine.newPwd')"
          :label="$t('mine.newPwd')"
          :placeholder="$t('mine.newPwd')"
          :rules="[{ required: true, message: $t('mine.inputNewPwd') }]"
        />
        <van-field
          v-model="frm.rePassword"
          autocomplete="new-password"
          type="password"
          :name="$t('mine.confrmNewPwd')"
          :label="$t('mine.confrmNewPwd')"
          :placeholder="$t('mine.confrmNewPwd')"
          :rules="[
            { required: true, message: $t('inputNewPwdAgain') },
            { validator, message: $t('mine.newPwdDiff') },
          ]"
        />
      </template>
      <template v-else>
        <van-field
          v-model="frm.password"
          autocomplete="new-password"
          type="password"
          :name="$t('mine.qknewPwd')"
          :label="$t('mine.qknewPwd')"
          :placeholder="$t('mine.qknewPwd')"
          :rules="[{ required: true, message: $t('mine.inputPlz') }]"
        />
        <van-field
          v-model="frm.rePassword"
          autocomplete="new-password"
          type="password"
          :name="$t('mine.confrmqkPwd')"
          :label="$t('mine.confrmqkPwd')"
          :placeholder="$t('mine.confrmqkPwd')"
          :rules="[
            { required: true, message: $t('mine.inputPlzAgain') },
            { validator, message: $t('mine.inputTisDiff') },
          ]"
        />
      </template>
      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          size="large"
          class="m-btn"
        >
          {{ $t('submit') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import api from '@/api'
defineOptions({ name: 'ModifyWithdrawalPwd' })

const router = useRouter()
const store = useAppStore()
const { t } = useI18n()
const isModify = ref(false)
const frm = ref({
  oldPassword: '',
  password: '',
  rePassword: '',
})

const validator = (val: string) => {
  const b = val !== frm.value.password || val.trim().length === 0
  console.log('---b--', b)

  return !b
}

function onClickLeft() {
  router.back()
}

async function onSubmit() {
  if (isModify.value) {
    await editDrawingPwd({
      old_qk_pwd: frm.value.oldPassword,
      qk_pwd: frm.value.password,
      qk_pwd_confirmation: frm.value.rePassword,
    })
  } else {
    await setDrawPwd({ qk_pwd: frm.value.password })
  }
}

function init() {
  const user = store.getUser()
  if (user && user.has_qk_pwd === false) {
    isModify.value = false
  } else {
    isModify.value = true
  }
}
//修改取款密码
async function editDrawingPwd(d: object) {
  store.loading()
  try {
    const resp = await api.modifyDrawingPwd(d)
    console.log('set drawing pwd resp:', resp)
    if (resp && resp.code === 200) {
      store.stopLoad()
      showToast({
        message: resp.message ?? t('success'),
        onClose: () => {
          router.back()
        },
      })
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    store.stopLoad()
    const msg = (err as Error).message
    if (msg && msg.length > 0) {
      showToast(msg)
    }
  }
}
//设置取款密码
async function setDrawPwd(d: object) {
  store.loading()
  try {
    const resp = await api.setDrawingPwd(d)
    console.log('set drawing pwd resp:', resp)
    if (resp && resp.code === 200) {
      store.stopLoad()
      showToast({
        message: resp.message ?? t('success'),
        onClose: () => {
          const u = store.getUser()
          if (u) {
            u.has_qk_pwd = true
            store.setUser(u)
          }
          router.back()
        },
      })
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    store.stopLoad()
    const msg = (err as Error).message
    if (msg && msg.length > 0) {
      showToast(msg)
    }
  }
}
onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.m-login-pwd {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-frm {
    margin-top: 10px;
  }
  .m-btn {
    margin-top: 40px;
  }
}
</style>
