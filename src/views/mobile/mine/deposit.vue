<template>
  <div class="m-deposit">
    <van-nav-bar
      left-arrow
      :title="$t('mine.quickDeposit')"
      @click-left="onClickLeft"
    />
    <!-- payemt type -->
    <div class="mg-top-10 m-cell">
      <div class="m-title"><span> 1、</span>{{ $t('pay_type') }}</div>
      <div class="m-cell-bd">
        <div class="m-scroll">
          <div
            class="m-cell-bd-item"
            :class="{ 'm-activie': payIdx === 0 }"
            @click.stop="changePayTypeHandler(0)"
            v-if="online != null && online.length > 0"
          >
            <van-image
              src="data:image/png;base64,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"
              fix="contain"
              class="m-img"
            ></van-image>
            <div class="m-label">{{ $t('online_pay') }}</div>
            <van-image
              class="m-border m-bor"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABSElEQVRYR8XXP07DMBQG8O9VvUKvwMItMjMgVe0J2JCqRIwM5QS0LGyMLHQBdW99CRbmzsxdmoccqVVa4vg58Z/Mkd8vn/1sh7IFPyHhQ7p2tuQPAJPYDgZUBUiFOAOkQPwDxEY0AgIivgFc19eZEeAbwcDjYIBPLqEX+wnRCvCFYMbDtqDnqt0Jc3ECHbpjddnKDNxvc3ptKq7HtybggFhtcprW95MSuFM5vZmKOwGs00HYgzDdzGitESXjSxX0nr3wHAzjTitOQJjEb8kYq4JUBbYUd05AiNjxATc0xG3blx/Hck5AhGD8gHAlOVc6A6xrQlLdpQtM4/U9RXslIJoOSxJeAH2mwxugK8IroAvCO8AVEQTggggGkCKCAiSI4AAbIgqgDRENYEJEBTQhogMuEUkAdUQywBHBwOj0cyq8Q3h9Td8n/gCgr8muR5XnggAAAABJRU5ErkJggg=="
              fit="contain"
            ></van-image>
          </div>
          <div
            class="m-cell-bd-item"
            :class="{ 'm-activie': payIdx === 1 }"
            @click.stop="changePayTypeHandler(1)"
            v-if="normal != null && normal.length > 0"
          >
            <van-image
              src="data:image/png;base64,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"
              fix="contain"
              class="m-img"
            ></van-image>
            <div class="m-label">{{ $t('company_pay') }}</div>
            <van-image
              class="m-border m-bor"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABSElEQVRYR8XXP07DMBQG8O9VvUKvwMItMjMgVe0J2JCqRIwM5QS0LGyMLHQBdW99CRbmzsxdmoccqVVa4vg58Z/Mkd8vn/1sh7IFPyHhQ7p2tuQPAJPYDgZUBUiFOAOkQPwDxEY0AgIivgFc19eZEeAbwcDjYIBPLqEX+wnRCvCFYMbDtqDnqt0Jc3ECHbpjddnKDNxvc3ptKq7HtybggFhtcprW95MSuFM5vZmKOwGs00HYgzDdzGitESXjSxX0nr3wHAzjTitOQJjEb8kYq4JUBbYUd05AiNjxATc0xG3blx/Hck5AhGD8gHAlOVc6A6xrQlLdpQtM4/U9RXslIJoOSxJeAH2mwxugK8IroAvCO8AVEQTggggGkCKCAiSI4AAbIgqgDRENYEJEBTQhogMuEUkAdUQywBHBwOj0cyq8Q3h9Td8n/gCgr8muR5XnggAAAABJRU5ErkJggg=="
              fit="contain"
            ></van-image>
          </div>
        </div>
      </div>
    </div>
    <!-- channel -->
    <div class="mg-top-10 m-cell">
      <div class="m-title"><span> 2、</span>{{ $t('pay_channel') }}</div>
      <div class="m-cell-bd m-2bd">
        <div class="m-scroll">
          <div
            v-for="(item, idx) in currentChannel"
            :key="idx"
            class="m-cell-bd-item m-2item"
            :class="{ 'm-activie': channelIdx === idx }"
            @click.stop="changeChannelHandler(idx)"
          >
            <van-image
              :src="
                channelImgList[item.type] ??
                'data:image/png;base64,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'
              "
              fix="contain"
              class="m-img"
            ></van-image>
            <div class="m-item-right">
              <div class="m-f12 m-h88 m-1row">
                {{ item?.type_text ?? '' }}
              </div>
              <div class="m-f12 m-h88 m-1row-nowrap">
                <marquee class="">{{ item?.desc ?? '' }}</marquee>
              </div>
            </div>
            <van-image
              class="m-border m-bor"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABSElEQVRYR8XXP07DMBQG8O9VvUKvwMItMjMgVe0J2JCqRIwM5QS0LGyMLHQBdW99CRbmzsxdmoccqVVa4vg58Z/Mkd8vn/1sh7IFPyHhQ7p2tuQPAJPYDgZUBUiFOAOkQPwDxEY0AgIivgFc19eZEeAbwcDjYIBPLqEX+wnRCvCFYMbDtqDnqt0Jc3ECHbpjddnKDNxvc3ptKq7HtybggFhtcprW95MSuFM5vZmKOwGs00HYgzDdzGitESXjSxX0nr3wHAzjTitOQJjEb8kYq4JUBbYUd05AiNjxATc0xG3blx/Hck5AhGD8gHAlOVc6A6xrQlLdpQtM4/U9RXslIJoOSxJeAH2mwxugK8IroAvCO8AVEQTggggGkCKCAiSI4AAbIgqgDRENYEJEBTQhogMuEUkAdUQywBHBwOj0cyq8Q3h9Td8n/gCgr8muR5XnggAAAABJRU5ErkJggg=="
              fit="contain"
            ></van-image>
          </div>
        </div>
      </div>
    </div>
    <!-- options -->
    <div class="mg-top-10 m-cell w-100">
      <div
        v-if="
          ['company_alipay', 'company_wechat'].includes(
            getCurrentChannel?.type ?? '',
          )
        "
      >
        <van-cell-group inset style="margin: 0px">
          <van-field
            style="padding-left: 0px; padding-right: 0px"
            :model-value="getCurrentChannel?.account"
            :label="$t('recharge_qrcode')"
            readOnly
          >
            <template #input>
              <van-image
                :src="getImgUrl(getCurrentChannel?.qrcode ?? '')"
                fit="contain"
                class="m-qrcode"
              ></van-image>
            </template>
          </van-field>

          <van-field
            style="padding-left: 0px; padding-right: 0px"
            :model-value="getCurrentChannel?.account"
            :label="$t('recharge_account')"
            readonly
          >
            <template #button>
              <van-button
                size="small"
                plain
                hairline
                type="primary"
                @click="copyHandler(getCurrentChannel?.account ?? '')"
                >{{ $t('copy') }}</van-button
              >
            </template>
          </van-field>

          <van-field
            style="padding-left: 0px; padding-right: 0px"
            :model-value="getCurrentChannel?.name"
            :label="$t('recharge_username')"
            readonly
          >
            <template #button>
              <van-button
                size="small"
                plain
                hairline
                type="primary"
                @click="copyHandler(getCurrentChannel?.name ?? '')"
                >{{ $t('copy') }}</van-button
              >
            </template>
          </van-field>
        </van-cell-group>
      </div>
      <div
        v-else-if="(getCurrentChannel?.type ?? '') === 'company_bankpay'"
        style="width: 100%"
      >
        <van-cell-group inset style="margin: 0px">
          <van-field
            style="padding-left: 0px; padding-right: 0px"
            :model-value="getCurrentChannel?.account"
            :label="$t('account')"
            readonly
          >
            <template #button>
              <van-button
                size="small"
                plain
                hairline
                type="primary"
                @click="copyHandler(getCurrentChannel?.account ?? '')"
                >{{ $t('copy') }}</van-button
              >
            </template>
          </van-field>

          <van-field
            style="padding-left: 0px; padding-right: 0px"
            :model-value="getCurrentChannel?.name"
            label="持卡人姓名"
            readonly
          >
            <template #button>
              <van-button
                size="small"
                plain
                hairline
                type="primary"
                @click="copyHandler(getCurrentChannel?.name ?? '')"
                >{{ $t('copy') }}</van-button
              >
            </template>
          </van-field>

          <van-field
            style="padding-left: 0px; padding-right: 0px"
            :model-value="
              getCurrentChannel?.params.bank_type +
              '-' +
              getCurrentChannel?.params.bank_type_text
            "
            :label="$t('open_bank')"
            readonly
          >
            <template #button>
              <van-button
                size="small"
                plain
                hairline
                type="primary"
                @click="
                  copyHandler(
                    getCurrentChannel?.params.bank_type +
                      '-' +
                      getCurrentChannel?.params.bank_type_text,
                  )
                "
                >{{ $t('copy') }}</van-button
              >
            </template>
          </van-field>
        </van-cell-group>
      </div>
      <div v-else>
        <van-cell-group inset style="margin: 0px; width: 100%">
          <van-field
            style="padding-left: 0px; padding-right: 0px"
            :model-value="getCurrentChannel?.memo ?? ''"
            :label="$t('rechate_address')"
            readonly
          >
            <template #button>
              <van-button
                size="small"
                plain
                hairline
                type="primary"
                @click="copyHandler(getCurrentChannel?.memo ?? '')"
                >{{ $t('copy') }}</van-button
              >
            </template>
          </van-field>
        </van-cell-group>
      </div>
    </div>
    <!-- money -->
    <div class="mg-top-10 m-cell m-3f" style="height: auto">
      <van-cell-group inset style="margin: 0px">
        <template v-if="(getCurrentChannel?.type ?? '').endsWith('_usdt')">
          <div class="m-title m-f14">
            {{ $t('transfer_amount') }}(<span class="m-c-red"
              >{{ getMinPrice }}~{{ getMaxPrice }}</span
            >)
          </div>
          <van-field
            v-model="money"
            :placeholder="$t('input_transfer_amount')"
            class="m-input"
          />
          <div class="m-title m-f14 mg-top-10">
            {{ $t('transfer_out_address') }}
          </div>
          <van-field
            v-model="account"
            :placeholder="$t('input_transfer_out_addr')"
            class="m-input"
          />
          <div class="m-title m-f14 mg-top-10">{{ $t('upload_cert') }}</div>
          <van-field v-model="payment_pic" class="m-input">
            <template #input>
              <van-uploader
                v-model="fileList"
                :max-count="1"
                accept="image/*"
                :after-read="uploadHandler"
              />
            </template>
          </van-field>
        </template>
        <template v-else>
          <template v-if="payIdx === 1">
            <div class="m-title m-f14">{{ $t('transfer_account') }}</div>
            <van-field
              v-model="account"
              :placeholder="$t('input_recharge_amount')"
              class="m-input"
            />

            <div class="m-title m-f14 mg-top-10">{{ $t('transfer_user') }}</div>
            <van-field
              v-model="name"
              :placeholder="$t('iput_transfer_amount')"
              class="m-input"
            />
          </template>

          <div class="m-title m-f14" :class="{ 'mg-top-10': payIdx === 1 }">
            {{ $t('transfer_amount') }}(<span class="m-c-red"
              >{{ getMinPrice }}~{{ getMaxPrice }}</span
            >)
          </div>
          <van-field
            v-model="money"
            :placeholder="$t('input_transfer_amount')"
            class="m-input"
          />
          <template v-if="payIdx === 1">
            <div class="m-title m-f14 mg-top-10">{{ $t('upload_cert') }}</div>
            <van-field v-model="payment_pic" class="m-input">
              <template #input>
                <van-uploader
                  v-model="fileList"
                  :max-count="1"
                  accept="image/*"
                  :after-read="uploadHandler"
                />
              </template>
            </van-field>
          </template>
        </template>
      </van-cell-group>
      <van-button
        type="primary"
        round
        size="large"
        class="m-sub-btn"
        @click="submitHandler"
        >{{ $t('confirm') }}</van-button
      >
    </div>

    <div class="mg-top-10 m-cell m-tips m-c-red2">
      <div class="m-c-red m-b10">{{ $t('sweetWarning') }}：</div>
      <p class="m-f12">
        {{ $t('deposit.detail1') }}
      </p>
      <p class="m-f12">
        {{ $t('deposit.detail2') }}
      </p>
      <p class="m-f12">
        {{ $t('deposit.detail3') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ref, onMounted, computed } from 'vue'
import { getImgUrl } from '@/utils/tools'
import api from '@/api'

defineOptions({ name: 'DepositVue' })

import type { ApiPaymentItem } from 'typings'
import useClipboard from 'vue-clipboard3'
import { showToast } from 'vant'
import { getCurrentTime } from '@/utils/tools'

import alipayImg from '@/assets/mobile/pay_alipay.png'
import wechactImg from '@/assets/mobile/pay_wechat.png'
import bankImg from '@/assets/mobile/pay_bank.png'
import unionImg from '@/assets/mobile/pay_union.png'
import usdtImg from '@/assets/mobile/usdt.jpg'
import { useI18n } from 'vue-i18n'

const channelImgList = ref({
  online_alipay: alipayImg,
  online_union_quick: unionImg,
  online_wechat: wechactImg,
  online_union_scan: unionImg,
  company_bankpay: bankImg,
  company_alipay: alipayImg,
  company_wechat: wechactImg,
  company_usdt: usdtImg,
  online_usdt: usdtImg,
})
const router = useRouter()
const store = useAppStore()
const payIdx = ref(0)
const channelIdx = ref(0)
const { toClipboard } = useClipboard()
const online = ref<ApiPaymentItem[] | null>(null)
const normal = ref<ApiPaymentItem[] | null>(null)

const money = ref('')
const account = ref('')
const name = ref('')
const payment_pic = ref('')

const currentChannel = ref<ApiPaymentItem[] | null>(null)
const fileList = ref([])
const img = ref('')
const { t } = useI18n()

const getMinPrice = computed(() => {
  const nItem: ApiPaymentItem | null = currentChannel.value
    ? currentChannel.value[channelIdx.value]
    : null
  return nItem?.min ?? 0
})

const getMaxPrice = computed(() => {
  const nItem: ApiPaymentItem | null = currentChannel.value
    ? currentChannel.value[channelIdx.value]
    : null
  return nItem?.max ?? 0
})

const getCurrentChannel = computed(() => {
  const nItem: ApiPaymentItem | null = currentChannel.value
    ? currentChannel.value[channelIdx.value]
    : null
  return nItem
})

async function submitHandler() {
  const cc: ApiPaymentItem | null = currentChannel.value
    ? currentChannel.value[channelIdx.value]
    : null
  if (!cc) {
    return
  }
  let d: object = { payment_id: cc.id, payment_type: cc.type }

  switch (payIdx.value) {
    case 0:
      const amount = Number(money.value)
      if (amount <= 0) {
        showToast(t('input_transfer_amount'))
        return
      }
      if (account.value.trim() == '') {
        showToast(t('input_transfer_out_addr'))
        return
      }
      //提交至后台
      await submitOnline({
        ...d,
        money: money.value,
        account: account.value,
        payment_pic: payment_pic.value,
      })
      break
    case 1:
      switch (cc.type) {
        case 'company_bankpay':
        case 'company_alipay':
        case 'company_wechat':
          if (account.value && account.value.trim().length <= 0) {
            showToast(t('input_recharge_amount'))
            return
          }
          if (name.value && name.value.trim().length <= 0) {
            showToast(t('iput_transfer_amount'))
            return
          }
          if (money.value && money.value.trim().length <= 0) {
            showToast(t('input_transfer_amount'))
            return
          }

          d = {
            ...d,
            money: money.value,
            account: account.value,
            name: name.value,
            payment_account: cc.account,
            payment_name: cc.name,
            hk_at: getCurrentTime(),
            payment_pic: img.value,
          }

          if (cc.type === 'company_bankpay') {
            d = { ...d, payment_bank_type: cc.params.bank_type }
          }
          await submitNormal(d)
          break
        case 'company_usdt':
          const amount = Number(money.value)
          if (amount <= 0) {
            showToast(t('input_transfer_amount'))
            return
          }
          d = {
            ...d,
            money: money.value,
            account: account.value,
            name: name.value,
            payment_account: cc.account,
            payment_name: cc.name,
            hk_at: getCurrentTime(),
            payment_pic: img.value,
          }
          //提交至后台
          await submitNormal(d)
          break
      }
  }
}

async function uploadHandler(file: any) {
  console.log('file', file)
  store.loading()
  try {
    const resp = await api.uploadFile({ file: file.file })
    console.log('uploadFile resp:', resp)
    if (resp && resp.code === 200 && resp.file_url) {
      payment_pic.value = resp.file_url
    } else {
      throw new Error(resp.message)
    }
    store.stopLoad()
  } catch (err) {
    store.stopLoad()
    const msg = (err as Error).message ?? ''
    if (msg.length > 0) {
      showToast(msg)
    }
  }
}
//返回
function onClickLeft() {
  router.back()
}

//切换充值类别
function changePayTypeHandler(n: number) {
  payIdx.value = n
  switch (n) {
    case 0:
      currentChannel.value = online.value
      channelIdx.value = 0
      break
    case 1:
      currentChannel.value = normal.value
      channelIdx.value = 0
      break
  }
}
//切换充值渠道
function changeChannelHandler(n: number) {
  channelIdx.value = n
}
// 复制
function copyHandler(t: string | null) {
  if (t && t.trim().length > 0) {
    toClipboard(t)
    showToast('复制成功')
  }
}

//获取在线充值信息
async function getOnlinePayment() {
  try {
    const resp = await api.paymentOnline()
    console.log('online payment resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      online.value = resp.data
      payIdx.value = 0
      currentChannel.value = online.value
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    console.log('online payment err', err)
    const msg = (err as Error).message ?? ''
    if (msg.length > 0) {
      showToast(msg)
    }
  }
}
// 获取普通充值信息
async function getNormalPayment() {
  try {
    const resp = await api.paymentNormal()
    console.log('normal payment resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      normal.value = resp.data
      if (currentChannel.value === null) {
        payIdx.value = 1
        currentChannel.value = normal.value
      }
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    console.log('normal payment err', err)
    const msg = (err as Error).message ?? ''
    if (msg.length > 0) {
      showToast(msg)
    }
  }
}

// 提交在线支付
async function submitOnline(d: object) {
  store.loading()
  try {
    const resp = await api.rechargeOnline(d)
    console.log('online payment resp:', resp)

    if (resp && resp.code === 200) {
      // online.value = resp.data
      // currentChannel.value = online.value
      store.stopLoad()
      showToast(resp.message)
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    store.stopLoad()
    const msg = (err as Error).message ?? ''
    if (msg.length > 0) {
      // showToast(msg)
    }
  }
}
// 提交普通充值
async function submitNormal(d: object) {
  store.loading()
  try {
    const resp = await api.rechargeNormal(d)
    console.log('submit normal payment resp:', resp)
    if (resp && resp?.code === 200 && resp.data) {
      store.stopLoad()
      showToast(resp.message)
    } else {
      throw new Error(resp?.message ?? '')
    }
  } catch (err) {
    store.stopLoad()
    const msg = (err as Error).message ?? ''
    if (msg.length > 0) {
      showToast(msg)
    }
  }
}

async function init() {
  store.loading()
  await getOnlinePayment()
  await getNormalPayment()
  store.stopLoad()
}

onMounted(() => {
  init()
})
</script>

<style lang="less">
@import url('@/views/mobile/common.less');
</style>
<style lang="less" scoped>
.mg-top(@n: 10px) {
  margin-top: @n;
}
.flex(@r: row, @j: flex-start, @a: center) {
  display: flex;
  flex-direction: @r;
  justify-content: @j;
  align-items: @a;
}

.m-deposit {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-m-background);
  .mg-top-10 {
    .mg-top();
  }

  .m-qrcode {
    width: 150px;
    height: 150px;
  }
  .m-cell {
    .flex(column, flex-start, flex-start);
    background-color: var(--m-item-background);
    padding: 10px 16px;

    .m-title {
      height: 22px;
      font-size: 14px;
      color: var(--m-mine-label-color);
    }
    .m-cell-bd {
      height: 104px;
      width: 100%;
      overflow-x: auto;
      padding: 15px 10px;

      .m-scroll {
        .flex(row, flex-start, center);
        gap: 10px;

        .m-cell-bd-item {
          height: 74px;
          min-width: 66px;
          width: 66px;
          .flex(column, center,center);
          gap: 5px;
          background-color: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 0 3px;
          position: relative;

          .m-label {
            font-size: 12px;
            height: 17px;
            white-space: nowrap;
          }

          .m-border {
            width: 21px;
            height: 21px;
            position: absolute;
            top: 0px;
            right: 0px;
            display: none;
          }
        }
        .m-activie {
          border: 1px solid #4290ff;
          background-color: #fff;

          .m-bor {
            display: inherit;
          }
        }
        .m-img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .m-2bd {
      height: 90px;
      padding: 21px 0;
      overflow-x: auto;

      .m-scroll {
        .m-2item {
          .flex(row, flex-start, center);
          padding: 0 5px;
          height: 48px;
          min-width: 140px;
          width: 140px;
          gap: 5px;

          .m-item-right {
            .flex(column, space-between, center);
            flex: 1;
            gap: 5px;

            .m-1row {
              white-space: nowrap;
              overflow: hidden;
              // text-overflow: ellipsis;
            }
            .m-1row-nowrap {
              white-space: nowrap;
              overflow: hidden;
            }
          }
          .m-h88 {
            width: 93px;
            text-align: center;
          }
        }
      }
    }
  }
  .w-100 > div {
    width: 100%;
  }
  .m-3f {
    .m-input {
      font-size: 16px;
    }

    .m-sub-btn {
      height: 50px;
      margin: 20px 0px;
    }
  }
  ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
  }
}
</style>
