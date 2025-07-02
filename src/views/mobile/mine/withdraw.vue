<template>
  <div class="m-withdraw">
    <van-nav-bar
      left-arrow
      :title="$t('mine.sunmitWithdraw')"
      @click-left="onClickLeft"
    />
    <!-- form -->
    <van-form @submit="onSubmit" class="m-frm">
      <van-field
        v-model="frm.name"
        type="text"
        readonly
        :label="$t('mine.name')"
      />
      <van-field
        :model-value="store.getUser()?.money ?? 0"
        type="text"
        readonly
        :label="$t('mine.canDrawMoney')"
      />
      <van-field readonly :label="$t('mine.shouChannel')">
        <template #input>
          <van-dropdown-menu>
            <van-dropdown-item
              v-model="frm.bank"
              :options="bankList"
              :title="
                frm.bank.length <= 0 ? $t('selected') : bankList[frm.bank]
              "
              @change="changeDrawingHandler"
            />
          </van-dropdown-menu>
        </template>
        <template #button>
          <van-button
            size="small"
            plain
            hairline
            type="primary"
            @click.stop="goAddBank"
            >{{ $t('add') }}</van-button
          >
        </template>
      </van-field>
      <van-field
        :model-value="frm.account"
        type="text"
        readonly
        :label="$t('mine.cardName')"
      />
      <van-field
        :model-value="frm.card_no"
        type="text"
        readonly
        :label="$t('mine.cardAccount')"
      />
      <van-field
        v-model="frm.money"
        type="digit"
        :placeholder="$t('mine.inputPlz')"
        :label="$t('mine.drawMoney')"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            plain
            hairline
            @click="allMoney"
            >{{ $t('mine.allMoney') }}</van-button
          >
        </template>
      </van-field>

      <van-field
        v-model="frm.qk_pwd"
        type="password"
        :label="$t('mine.drawingPwd')"
        :placeholder="$t('mine.inputPlz')"
        :rules="[{ required: true, message: $t('mine.inputPlz') }]"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            plain
            hairline
            @click="goSetDrawingPwd"
            v-if="(store.getUser()?.has_qk_pwd ?? false) === false"
            >{{ $t('mine.settingWithdrawalPwd') }}</van-button
          >
        </template>
      </van-field>

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
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { showDialog, showToast, type DropdownItemOption } from 'vant'
import { invokeApi } from '@/utils/tools'
import type { ApiMemberBank } from 'typings'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
defineOptions({ name: 'WithdrawVue' })

const { t } = useI18n()
const router = useRouter()
const store = useAppStore()
const list = ref<ApiMemberBank[] | null>(null)
const bankList = ref<DropdownItemOption[]>([])
const hasBank = ref(true)
const hasQkPwd = ref(true)
const selectBank = ref<ApiMemberBank | null>(null)
const frm = ref({
  name: store.getUser()?.name ?? '',
  bank: '',
  account: '',
  card_no: '',
  money: '',
  qk_pwd: '',
})

//返回
function onClickLeft() {
  router.back()
}
// 添加提款信息
function goAddBank() {
  router.push({ name: 'card' })
}
//提款所有余额
function allMoney() {
  frm.value.money = `${store.getUser()?.money ?? 0}`
}

// 设置提款密码
function goSetDrawingPwd() {
  router.push({ name: 'withdrawalPwd' })
}
function changeDrawingHandler(v: string | number) {
  if (!list.value) {
    return
  }
  list.value.forEach(it => {
    if (it.id === v) {
      selectBank.value = it
      // console.log('it----', it)

      frm.value.account = it.owner_name
      frm.value.card_no = it.card_no
    }
  })
}
//提交提款信息
async function onSubmit() {
  // console.log('submit ', frm.value)
  //{"name":"wang gang wang","money":0,"account":"123123123123","member_bank_id":1,"member_bank_text":"中国工商银行","member_remark":"","qk_pwd":"12312233"}
  const resp = await invokeApi('drawing', {
    name: frm.value.account,
    money: frm.value.money,
    account: frm.value.card_no,
    member_bank_id: frm.value.bank,
    member_bank_text: selectBank.value?.bank_type_text,
    member_remark: '',
    qk_pwd: frm.value.qk_pwd,
  })
  console.log('resp', resp)

  if (!resp) {
    return
  }
  showToast(resp.message)
}
// 获取用户收款信息
async function userBankList() {
  const resp = await invokeApi('memberBank')
  if (!resp) {
    return
  }
  const data = resp.data ? (resp.data as ApiMemberBank[]) : []
  if (data.length > 0) {
    data.forEach(it => {
      bankList.value.push({ text: it?.bank_type_text, value: it.id })
    })
  }
  list.value = data
}
function setDrawingMsg() {
  showDialog({
    message: t('mine.notSetDrawingPwd'),
    beforeClose: () => {
      return true
    },
  })
}
async function init() {
  const user = store.getUser()
  await userBankList()
  if (!list.value || list.value.length <= 0) {
    hasBank.value = false
    showDialog({
      message: t('mine.bindDrawingAddress'),
      beforeClose: () => {
        // router.push({ name: 'card' })
        return true
      },
    })
    return
  }
  if (user && user.has_qk_pwd === false) {
    hasQkPwd.value = false
    setDrawingMsg()
    return
  }
}

onMounted(async () => {
  await init()
})
</script>

<style lang="less" scoped>
.m-withdraw {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-frm {
    margin-top: 10px;
    .m-btn {
      margin-top: 30px;
    }
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
.m-withdraw {
  .van-dropdown-menu {
    min-width: 30px;

    .van-dropdown-menu__bar {
      box-shadow: none;
      height: 20px;
      .van-dropdown-menu__title {
        padding-left: 0px;
      }
    }
  }
}
</style>
