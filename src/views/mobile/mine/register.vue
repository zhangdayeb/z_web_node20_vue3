<template>
  <div class="m-mine-register">
    <van-nav-bar
      left-arrow
      :title="$t('user.register')"
      @click-left="onClickLeft"
    />
    <div class="m-regiter-frm">
      <van-form ref="regiFrmRefs">
        <van-cell-group inset>
          <van-field
            v-model="frm.name"
            label-align="top"
            :required="true"
            :name="$t('register.username')"
            :label="$t('register.username')"
            :placeholder="$t('register.username')"
            :rules="[{ required: true, message: $t('register.inputUsername') }]"
          />
          <van-field
            v-model="frm.password"
            :required="true"
            label-align="top"
            type="password"
            :name="$t('register.password')"
            :label="$t('register.password')"
            :placeholder="$t('register.password')"
            :rules="[{ required: true, message: $t('register.inputPassword') }]"
          />
          <van-field
            v-model="frm.password_confirmation"
            :required="true"
            label-align="top"
            type="password"
            :name="$t('register.confirmPassword')"
            :label="$t('register.confirmPassword')"
            :placeholder="$t('register.confirmPassword')"
            :rules="[
              { required: true, message: $t('register.inputConfirmPassword') },
            ]"
          />
          <van-field
            v-if="
              (store.registerConf?.register_setting_json?.isRealNameRequred ??
                0) === '1'
            "
            v-model="frm.realname"
            :required="true"
            label-align="top"
            type="text"
            :name="$t('register.realName')"
            :label="$t('register.realName')"
            :placeholder="$t('register.realName')"
            :rules="[{ required: true, message: $t('register.inputRealname') }]"
          />

          <van-field
            v-model="frm.qk_pwd"
            :required="true"
            label-align="top"
            type="password"
            :name="$t('register.qkPwd')"
            :label="$t('register.qkPwd')"
            :placeholder="$t('register.qkPwd')"
            :rules="[{ required: true, message: $t('register.inputQkpwd') }]"
          />

          <van-field
            v-if="
              (store.registerConf?.register_setting_json?.isPhoneRequired ??
                0) === '1'
            "
            v-model="frm.phone"
            :required="true"
            label-align="top"
            type="digit"
            :name="$t('register.phone')"
            :label="$t('register.phone')"
            :placeholder="$t('register.phone')"
            :rules="[{ required: true, message: $t('register.inputPhone') }]"
          />
          <!-- @click="showPopHandler" -->
          <van-field
            v-model="frm.currency"
            :required="true"
            :is-link="true"
            :readonly="true"
            label-align="top"
            type="text"
            :name="$t('register.currency')"
            :label="$t('register.currency')"
            :placeholder="$t('register.inputCurrency')"
            :rules="[{ required: true, message: $t('register.inputCurrency') }]"
          ></van-field>
          <van-popup v-model:show="showPicker" position="bottom">
            <Picker
              :columns="columns"
              @confirm="onConfirm"
              @cancel="cancelHandler"
          /></van-popup>
          <van-field
            v-model="frm.invite_code"
            :required="false"
            label-align="top"
            type="text"
            :name="$t('register.inviteCode')"
            :label="$t('register.inviteCode')"
            :placeholder="$t('register.inputInviterCode')"
            :rules="[
              { required: false, message: $t('register.inputInviterCode') },
            ]"
          />
          <van-field
            v-if="
              (store.registerConf?.register_setting_json?.isCaptchaRequired ??
                0) === '1'
            "
            v-model="frm.captcha"
            :required="true"
            label-align="top"
            type="digit"
            :name="$t('register.captcha')"
            :label="$t('register.captcha')"
            :placeholder="$t('register.inputCaptcha')"
            :rules="[{ required: true, message: $t('register.inputCaptcha') }]"
          >
            <template #button>
              <van-image
                :src="captchaImg"
                fit="contain"
                class="m-img"
                @click.stop="refreshCaptcha"
              ></van-image>
            </template>
          </van-field>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="primary"
            native-type="button"
            @click.stop="submitRegisterHandler"
            >{{ $t('submit') }}</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Picker, showToast, type PickerConfirmEventParams } from 'vant'
import { useAppStore } from '@/stores/app'
import api from '@/api'

defineOptions({ name: 'RegisterVue' })

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const regiFrmRefs = ref()

const captchaImg = ref('')
const showPicker = ref(false)
const columns = ref([
  { text: '¥ 【人民币】', value: 'zh_cn' },
  { text: 'HK$ 【港幣】', value: 'zh_hk' },
  { text: '$ 【dollar】', value: 'en' },
  { text: '฿ 【บาท】', value: 'th' },
  { text: '₫ 【Việt tên dong】', value: 'vi' },
])
const currencyIndex = ref<number>(2)
const frm = ref({
  name: '',
  password: '',
  password_confirmation: '',
  realname: '',
  qk_pwd: '',
  phone: '',
  currency: columns.value[currencyIndex.value].text,
  captcha: '',
  key: '',
  invite_code: route.query?.invite_code ?? route.params?.invite_code ?? '',
  lang: '',
  register_site: '',
  sms_code: '',
})
function showPopHandler() {
  showPicker.value = true
}

function cancelHandler() {
  showPicker.value = false
}
function onConfirm({
  selectedOptions,
  selectedIndexes,
}: PickerConfirmEventParams) {
  frm.value.currency = `${selectedOptions[0]?.text}`
  currencyIndex.value = selectedIndexes[0]
  console.log('n', frm.value.currency, currencyIndex.value)
  showPicker.value = false
}
function submitRegisterHandler() {
  regiFrmRefs.value
    ?.validate()
    .then(async () => {
      try {
        frm.value.lang = columns.value[currencyIndex.value].value
        const resp = await api.userRegister(frm.value)
        console.log('register resp', resp, resp.message)
        if (resp && resp.code === 200 && resp.status === 'success') {
          store.setToken(resp.token)
          await store.getMeForApi()
          showToast({
            message: resp.message,
            onClose: () => {
              router.replace({ name: 'main' })
            },
          })
        } else {
          showToast({
            message: resp.message,
            onClose: () => {
              // router.replace({ name: 'main' })
            },
          })
        }
      } catch (err) {
        showToast((err as Error).message ?? '未知错误')
      }
    })
    .catch(e => {
      console.log(e)
    })
}
//刷新验证码
async function refreshCaptcha() {
  try {
    if (
      (store.registerConf?.register_setting_json?.isCaptchaRequired ?? 0) !==
      '1'
    ) {
      return
    }
    const resp = await api.authCaptcha()
    console.log('authCaptcha resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      captchaImg.value = resp.data?.img ?? ''
      frm.value.key = resp.data?.key
    }
  } catch (err) {
    console.log(err)
  }
}

async function getConfig() {
  try {
    const resp = await api.sysConfig({
      group: 'register',
      url: 'm001.7484i3927.top',
      is_mobile: 1,
    })
    console.log('register config resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      const tmp = resp.data
      tmp.register_setting_json = JSON.parse(resp.data.register_setting_json)
      store.$patch({ registerConf: tmp })
    }
  } catch (err) {
    console.log(err)
  }
}

// 返回
function onClickLeft() {
  router.go(-1)
}
// init
async function init() {
  store.loading()

  await getConfig()
  await refreshCaptcha()

  store.stopLoad()
}
onMounted(async () => {
  init()
})
</script>

<style scoped lang="less">
.m-mine-register {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-regiter-frm {
    margin: 16px 0px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .m-img {
      width: 100px;
      height: 25px;
    }
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
</style>
