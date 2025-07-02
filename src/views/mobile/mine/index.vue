<template>
  <div class="m-mine">
    <div class="m-header">
      <div class="m-user">
        <van-image :src="avatarImg" fit="contain" class="m-ava"></van-image>
        <div class="m-user-right">
          <h5 v-if="store.getUser() === null" @click.stop="loginHandler">
            {{ $t('mine.loginRegister') }}
          </h5>
          <div class="m-user-info" v-else>
            <span class="m-level-name">{{ store.getUser()?.name }}</span>
            <div class="m-user-level">
              <div class="m-img-bg">VIP</div>
              <span class="m-level-txt">{{ store.getUser()?.level }}</span>
            </div>
          </div>
          <span
            >{{ $t('mine.welcomeTo') }} {{ siteConfig?.site_name ?? '' }}</span
          >
        </div>
        <div class="m-seetings" @click="settingHandler"></div>
      </div>
      <div class="m-info">
        <div class="m-col m-gap10">
          <p>
            {{ $t('mine.centerWallet')
            }}<van-icon name="arrow" color="#c3dae9" class="m-p-icon" />
          </p>
          <h6>{{ Number(store.getUser()?.money ?? '0').toFixed(2) }}</h6>
        </div>
        <div class="m-col m-gap10">
          <p>
            {{ $t('mine.fsWallet')
            }}<van-icon name="arrow" color="#c3dae9" class="m-p-icon" />
          </p>
          <h6>{{ Number(store.getUser()?.fs_money ?? '0').toFixed(2) }}</h6>
        </div>
        <div
          class="m-col"
          @click="dwHandler(0)"
          style="display: flex; justify-content: center; align-items: center"
        >
          <van-image fit="contain" :src="dipositImg" class="m-icon" />
          <p>{{ $t('mine.deposit') }}</p>
        </div>
        <div
          class="m-col"
          @click="dwHandler(1)"
          style="display: flex; justify-content: center; align-items: center"
        >
          <van-image fit="contain" :src="withdrawImg" class="m-icon" />
          <p>{{ $t('mine.withdraw') }}</p>
        </div>
      </div>
    </div>
    <div class="m-func">
      <h5 class="m-label">{{ $t('mine.normalFunc') }}</h5>
      <div class="m-func-contain">
        <div class="m-func-item" @click.stop="recordHandler(1)">
          <van-image
            fit="contain"
            :src="trancationImg"
            class="m-img"
          ></van-image>
          <p>{{ $t('mine.moneyLog') }}</p>
        </div>
        <div class="m-func-item" @click.stop="recordHandler(2)">
          <van-image
            fit="contain"
            :src="betRecordImg"
            class="m-img"
          ></van-image>
          <p>{{ $t('mine.gameLog') }}</p>
        </div>
        <div class="m-func-item" @click.stop="recordHandler(3)">
          <van-image fit="contain" :src="vipImg" class="m-img"></van-image>
          <p>{{ $t('mine.levelRight') }}</p>
        </div>
        <div class="m-func-item" @click.stop="recordHandler(4)">
          <van-image fit="contain" :src="agentImg" class="m-img"></van-image>
          <p>{{ $t('mine.pullMoney') }}</p>
        </div>
      </div>
    </div>

    <!-- menu -->
    <van-cell-group class="m-mine-menu">
      <van-cell
        :title="$t('mine.persionalInfo')"
        is-link
        @click.stop="menuHandler(0)"
      >
        <template #icon>
          <van-image
            class="m-cell-icon"
            src="data:image/png;base64,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"
            fit="contain"
          ></van-image>
        </template>
      </van-cell>
      <van-cell
        :title="$t('mine.accountSafe')"
        is-link
        :value="$t('mine.safest')"
        @click.stop="menuHandler(1)"
      >
        <template #icon>
          <van-image
            class="m-cell-icon"
            src="data:image/png;base64,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"
            fit="contain"
          ></van-image>
        </template>
      </van-cell>
      <van-cell
        :title="$t('mine.bankCard')"
        is-link
        @click.stop="menuHandler(2)"
      >
        <template #icon>
          <van-image
            class="m-cell-icon"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAACaUlEQVR4Xu3cvy4EURgF8O8bIqIQD8ArKNCLRqPyBJLdZROdhsT60xgSrcbana1VoqESEZXwDBKRaCg1ZGU/kdDsTsyfszeZyRz1PbP3/ubYtTPmqvAHElAozbAQECwBAQkICoBxNpCAoAAYZwMJCAqAcTbQBWBpqz4vJgcqMmkmg+Br5Deu8uqJnnVGB9ZbG+X3sIX0NLCy3Zi2Tueu0HBdUipyHuxXF2MBlmv1hplU8lsbNzMf0uHxY3/ppfvoPQ0sb9avTWTOzTTye1TVgdnAr9xGApY2T25EbDa/S3Uzc8/z5pp7yzcETOkLA6rqvaidpnz9fMRMx8xsJ2yy/QBsBf5KOR8S6Wa5WmtNfFj7mYDp/ISAKeH+YgQkICgAxtlAAoICYJwNJCAoAMbZQAKCAmCcDcwyoIg8qcoDOMesx0fMZMHJd+Gsr9z1/OCrMa4nmPXjExA8QwQkICgAxvvQQH1TlUdwHpmOm9iQmEw5+RRWVV7SR+7KERC8rUlAAka+//K7cCTR/wMISEBQAIyzgQQEBcB4IRv4s+hP+1pLYqeeXjX3li+7M4UELNWCGbGvRBd6PZX9pl+tEVBECJjkdy9kLAEJCAqAcTYQBKzsNiatbReJDqN2FPjVQ36IJFKLHlzIP2OiWeKPIGB8q9CRBCQgKADG2UACggJgnA0kICgAxl03kA8bIjfWwZOb+3gf/jcm9wbQAmID8pH/cOfYj/xz04lwwNibTnDbk17ARNue/MS58c4vYpqNd6B32gKGuXcWeNIJSEBQAIyzgQQEBcA4G0hAUACMs4EEBAXAOBtIQFAAjH8DR9bjbzlk8EIAAAAASUVORK5CYII="
            fit="contain"
          ></van-image>
        </template>
      </van-cell>
      <van-cell
        :title="$t('mine.transferAmount')"
        is-link
        @click.stop="menuHandler(3)"
      >
        <template #icon>
          <van-icon name="exchange" class="m-cell-icon m-f17" />
        </template>
      </van-cell>
      <van-cell
        :title="$t('mine.myCollection')"
        is-link
        :value="$t('mine.loveIsHere')"
        @click.stop="menuHandler(4)"
      >
        <template #icon>
          <van-image
            class="m-cell-icon"
            src="data:image/png;base64,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"
            fit="contain"
          ></van-image>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="m-mine-menu m-mt10">
      <van-cell
        :title="$t('mine.myNotices')"
        is-link
        value="0"
        @click.stop="menuHandler(5)"
      >
        <template #icon>
          <van-icon name="chat-o" class="m-cell-icon m-f17" />
        </template>
      </van-cell>
      <van-cell
        :title="$t('mine.mxdaikuan')"
        is-link
        @click.stop="menuHandler(6)"
        v-if="1 === 2"
      >
        <template #icon>
          <van-icon name="balance-o" class="m-cell-icon m-f17" />
        </template>
      </van-cell>
      <van-cell
        :title="$t('mine.yuEBao')"
        is-link
        @click.stop="menuHandler(7)"
        v-if="1 === 2"
      >
        <template #icon>
          <van-icon name="cash-o" class="m-cell-icon m-f17" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-popup
      position="right"
      v-model:show="show"
      :style="{ width: '100%', height: '100%' }"
    >
      <van-nav-bar
        left-arrow
        :title="$t('user.settings')"
        @click-left="onClickLeft"
      />
      <div class="m-pop-contain">
        <van-cell-group class="m-mt10">
          <van-cell
            :title="$t('mine.safeSetting')"
            is-link
            to="safeSettings"
          ></van-cell>
        </van-cell-group>
        <van-cell-group class="m-mt10">
          <van-cell :title="$t('user.conactUs')" is-link></van-cell>
          <van-cell :title="$t('mine.aboutUs')" is-link></van-cell>
        </van-cell-group>

        <van-button class="m-mt10 m-btn-txt" @click="logoutHandler">{{
          $t('mine.logout')
        }}</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import avatarImg from '@/assets/mobile/avatar.png'
import dipositImg from '@/assets/mobile/mine_deposit.png'
import withdrawImg from '@/assets/mobile/mine_withdraw.png'

import trancationImg from '@/assets/mobile/transactionRecords.png'
import betRecordImg from '@/assets/mobile/betRecords.png'
import vipImg from '@/assets/mobile/vip.png'
import agentImg from '@/assets/mobile/agent.png'
import api from '@/api'
import { getDomain } from '@/utils/tools'
import { useAppStore } from '@/stores/app'
import { onMounted, ref } from 'vue'
import { showToast } from 'vant'
import type { SiteConfig } from 'typings'
import { useRouter } from 'vue-router'

defineOptions({ name: 'MineIndex' })
const router = useRouter()
const store = useAppStore()
const siteConfig = ref<SiteConfig | null>(null)
const show = ref(false)

async function getSiteConfig() {
  store.loading()
  try {
    const resp = await api.sysConfig({
      group: 'site',
      is_mobile: 1,
      url: getDomain(),
    })
    console.log('service config resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      siteConfig.value = resp.data
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    console.log(err)
    showToast((err as Error).message)
  }
  store.stopLoad()
}

function loginHandler() {
  store.$patch({ loginShow: true })
  // console.log('login show', store.getUser(), store.loginShow)
}

// 设置
function settingHandler() {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  show.value = true
}

// 返回
function onClickLeft() {
  show.value = false
}
// 存/取款
function dwHandler(n: number) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  switch (n) {
    case 0:
      router.push({ path: '/deposit' })
      break
    case 1:
      router.push({ path: '/withdraw' })
      break
  }
}

//记录
function recordHandler(n: number) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  switch (n) {
    case 1:
      router.push({ path: '/moneyLog' })
      break
    case 2:
      router.push({ path: '/gameRecord' })
      break
    case 3:
      router.push({ path: '/vip' })
      break
    case 4:
      router.push({ path: '/extension' })
      break
  }
}
//菜单
function menuHandler(n: number) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  switch (n) {
    case 0:
      router.push({ path: '/personal' })
      break
    case 1: //safeSettings
      router.push({ path: '/safeSettings' })
      break
    case 2:
      router.push({ path: '/card' })
      break
    case 3:
      router.push({ path: '/transfer' })
      break
    case 4:
      router.push({ path: '/collection' })
      break
    case 5:
      router.push({ path: '/notices' })
      break
    case 6:
      break
    case 7:
      break
  }
}

// 退出
async function logoutHandler() {
  store.loading()
  try {
    const resp = await api.logout()
    console.log('logout resp:', resp)
    if (resp && resp.code === 200) {
      store.logout()
      store.stopLoad()
      showToast({
        message: resp.message,
        onClose: () => {
          window.location.href = '/'
        },
      })
    }
  } catch (err) {
    console.log('logout err', err)
    showToast((err as Error).message)
    store.stopLoad()
  }
}
onMounted(async () => {
  await getSiteConfig()
})
</script>
<style lang="less" scoped>
.m-mine {
  display: flex;
  flex-direction: column;
  // height: calc(100% - 50px);
  background: var(--color-m-background);
  padding-bottom: 60px;

  .m-header {
    height: 200px;
    background: url('../../../assets/mobile/mine_header_bg.png') no-repeat;
    background-size: 100% 100%;
    color: #3c4045;
    display: flex;
    flex-direction: column;

    .m-user {
      padding: 25px;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100px;
      gap: 15px;

      .m-ava {
        width: 58px;
        height: 58px;
      }
      &-right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;

        .m-user-info {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          gap: 5px;

          .m-level-name {
            font-size: 18px;
            font-weight: 400;
          }
          .m-user-level {
            // width: 31px;
            height: 20px;
            background-image: url('../../../assets/mobile/level_bg.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 2px;
            padding: 0 5px;
            justify-content: flex-start;

            .m-img-bg {
              color: #fff;
              font-size: 14px;
            }
            .m-level-txt {
              color: #fff;
              font-size: 14px;
            }
          }
        }
        h5 {
          font-size: 18px;
          font-weight: 400;
        }
        span {
          font-size: 12px;
        }
      }
      .m-seetings {
        position: absolute;
        right: 20px;
        top: 15px;
        width: 21px;
        height: 20px;
        background: url('../../../assets/mobile/setting.png') no-repeat;
        background-size: 100%;
        z-index: 2;
      }
    }
    .m-info {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: flex-end;
      flex: 1;
      height: 100px;
      padding: 0 28px 25px 28px;
      background: url('../../../assets/mobile/mine_header_bg2.png') no-repeat;
      background-size: 100% 100%;

      .m-col {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .m-p-icon {
          margin-left: 5px;
        }
        .m-icon {
          width: 26px;
          height: 22px;
        }
        p {
          font-size: 12px;
        }
        h6 {
          font-size: 18px;
          font-weight: 400;
        }
      }
      .m-gap10 {
        gap: 10px;
      }
    }
  }

  .m-func {
    display: flex;
    flex-direction: column;
    height: 130px;
    margin-bottom: 10px;
    padding: 0 15px;
    background-color: var(--van-nav-bar-background);

    .m-label {
      height: 40px;
      line-height: 40px;
      font-size: 13px;
      font-weight: 700;
      color: var(--m-mine-label-color);
      border-bottom: 1px solid #e8ebf6;
    }
    &-contain {
      height: 90px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      .m-func-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
        color: var(--m-mine-label-color);
        gap: 5px;

        .m-img {
          width: 34px;
          height: 34px;
        }
        p {
          font-size: 12px;
        }
      }
    }
  }

  .m-mine-menu {
    .m-cell-icon {
      margin-top: 3.5px;
      margin-right: 10px;
      width: 17px;
      height: 17px;
    }
    .m-f17 {
      font-size: 17px;
    }
  }
  .m-mt10 {
    margin-top: 10px;
  }

  .m-pop-contain {
    display: flex;
    flex-direction: column;
    background: #eef3f8;
    flex: 1;
    height: calc(100% - 46px);

    .m-btn-txt {
      color: #ff4f4f;
    }
  }
}
</style>
<style lang="less">
.m-mine-menu {
  .van-cell__value {
    span {
      white-space: nowrap;
    }
  }
}
</style>
