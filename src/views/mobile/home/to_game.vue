<template>
  <div class="m-toGame-par">
    <van-nav-bar
      left-arrow
      :title="$t('mine.toGame')"
      @click-left="onClickLeft"
    />
    <div class="m-toGame">
      <div class="m-transfer-area" v-if="is_trans_on === 0">
        <div class="m-title">{{ $t('mine.transferAmount') }}</div>
        <div class="m-content">
          <div class="m-item">
            <div class="m-label">{{ $t('mine.centerWalletBalance') }}</div>
            <div class="m-txt m-gap">
              <span>{{ moneyInfo['money'].money }}</span>
              <van-icon
                name="replay"
                style="font-weight: 700"
                v-if="!loading"
                @click="getBalance"
              />
              <van-loading size="14" v-else color="#000" />
            </div>
          </div>
          <div class="m-item">
            <div class="m-label">
              {{ target.api_name }} {{ $t('mine.balance') }}
            </div>
            <div class="m-txt">
              <span>{{ target.money }}</span>
            </div>
          </div>
          <van-field
            class="m-item"
            v-model="money"
            :label="$t('transferIn') + ' ' + target.api_name"
            :placeholder="$t('inputTransferInAmount')"
            clearable
          >
            <template #button>
              <van-button
                class="m-btnn"
                size="small"
                color="#8b0000"
                @click="transferIn"
                :disabled="(target?.wallet_type ?? 0) === 1"
                >{{ $t('transferIn') }}</van-button
              >
            </template>
          </van-field>
          <div class="m-item m-white">
            <van-button
              size="small"
              color="darkslategray"
              class="m-btn"
              @click="enterGame"
              :disabled="Number(target.money) < 0"
              >{{ $t('enterGame') }}</van-button
            >
          </div>
        </div>
      </div>
      <!-- <van-loading type="spinner" v-else /> -->
    </div>
    <a ref="gameLink" href="" target="_self" style="display: none"></a>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { invokeApi, isMobile } from '@/utils/tools'
import type { ApiMoneyRespData, ApiWallet } from 'typings'
import { showDialog, showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'ToGame' })
const { t } = useI18n()
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const is_trans_on = ref(-1)
const moneyInfo = ref<{ [key: string]: ApiWallet }>({})
const money = ref('')
const target = ref<ApiWallet>({
  money: '0.00',
  api_name: '',
  api_title: '',
  wallet_type: 0,
  loading: false,
})
const gameUrl = ref('')
const gameLink = ref<HTMLAnchorElement>()
const loading = ref(false)

//返回
function onClickLeft() {
  router.back()
}

async function transferIn() {
  let m = Number(money.value)
  if (m <= 0 || isNaN(m)) {
    money.value = moneyInfo.value['money'].money ?? 0
  }
  m = Number(money.value)
  if (m <= 0) {
    showDialog({ message: t('transferInMoneyMustThan0') })
    return
  }
  await deposit()
}

async function deposit() {
  const resp = await invokeApi('gameDeposit', {
    api_code: route.params.code,
    money_type: 'money',
    money: money.value,
  })
  if (!resp) {
    return
  }
  if (resp && resp.message) {
    showDialog({ message: resp.message })
    return
  }
  money.value = ''
  showToast({
    message: t('success'),
    onClose: async () => {
      await getBalance()
    },
  })
}

async function getGame() {
  const resp = await invokeApi(
    'money',
    { api_code: route.params.code },
    '',
    false,
  )
  if (resp) {
    const data = resp.data as ApiMoneyRespData
    is_trans_on.value = data.is_trans_on
    data.money_info.forEach(it => {
      moneyInfo.value[it.api_name] = it
      if (it.api_name === route.params.code) {
        target.value = it
      }
    })
    const user = store.getUser()
    if (user) {
      user.fs_money = Number(data.money_info[1]?.money ?? '0')
      user.ml_money = data.money_info[0]?.money ?? '0'
      store.setUser(user)
    }
  }
}
async function getBalance() {
  loading.value = true
  store.stopLoad()
  await getGame()
  loading.value = false
}
async function enterGame() {
  await gameLoginAction()
}
async function gameLoginAction() {
  const resp = await invokeApi('gameLogin', {
    gameCode: route.params.game,
    api_code: route.params.code,
    ismobile: route.params.mobile,
  })
  if (resp && resp.code && resp.code != 200) {
    showDialog({ message: resp.message })
  } else {
    gameUrl.value = resp?.game_url?.toString() ?? ''
    console.log("=======================game_url======================")
    console.log(gameUrl.value)
    if (gameUrl.value != '') {
      const h = isMobile()
      if (h === false && window.parent) {
        // 如果是移动端，使用a标签跳转
        window.parent.location.href = gameUrl.value
      } else {
        // 直接跳转到游戏页面
        window.location.href = gameUrl.value
      }
    }
  }
}
onMounted(async () => {
  await getBalance()
  if (is_trans_on.value === 1) {
    await enterGame()
  }
})
</script>

<style lang="less" scoped>
.m-toGame-par {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-toGame {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);

    .m-transfer-area {
      margin: 0px 16px;
      height: 234px;
      width: calc(100% - 32px);
      display: flex;
      flex-direction: column;
      background-color: #fff;

      .m-title {
        background-color: #333;
        color: #fff;
        height: 42px;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      .m-content {
        padding: 10px 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 10px;

        .m-item {
          height: 33px;
          width: 100%;
          background-color: #ddd;
          color: #333;
          display: flex;
          flex-direction: row;
          align-items: center;

          .m-label {
            background-color: #466488;
            color: #fff;
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 10px;
          }
          .m-darkgreen {
            background-color: darkgreen;
          }
          .m-txt {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
          .m-gap {
            gap: 5px;
          }
          .m-btnn {
            padding-left: 20px;
            padding-right: 20px;
          }
          .m-btn {
            width: 200px;
            height: 33px;
            font-size: 14px;
          }
        }
        .m-white {
          background-color: #fff;
          justify-content: center;
        }
      }
    }
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
.m-toGame {
  .m-transfer-area {
    .van-field {
      padding: 0px;
      .van-field__label {
        background-color: darkgreen;
        color: #fff;
        height: 100%;
        padding: 0px 10px;
        margin-right: 5px;
        width: auto;
        line-height: 33px;
        min-width: 64px;
      }
      .van-field__control {
        text-align: center;
      }
    }
  }
}
</style>
