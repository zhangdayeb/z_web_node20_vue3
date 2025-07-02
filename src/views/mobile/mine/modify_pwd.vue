<template>
  <div class="m-login-pwd">
    <van-nav-bar
      left-arrow
      :title="$t('mine.modifyLoginPwd')"
      @click-left="onClickLeft"
    />
    <van-form @submit="onSubmit" class="m-frm">
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
import api from '@/api'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
defineOptions({ name: 'ModifyLoginPwd' })

const { t } = useI18n()
const router = useRouter()
const store = useAppStore()
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
  await modifyPwdAction()
}

async function modifyPwdAction() {
  store.loading()
  try {
    const resp = await api.modifyLoginPwd({
      oldpassword: frm.value.oldPassword,
      password_confirmation: frm.value.rePassword,
      password: frm.value.password,
    })
    console.log('modify login pwd resp:', resp)

    if (resp && resp.code === 200) {
      store.stopLoad()
      showToast({
        message: t('mine.successAndLoginAgain'),
        onClose: () => {
          store.logout()
          window.location.href = '/'
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
onMounted(() => {})
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
