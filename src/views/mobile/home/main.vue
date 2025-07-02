<template>
  <div class="m-main">
    <!-- i18n -->
    <LanguageVue />
    <!-- banner -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, idx) in banners" :key="idx">
        <van-image :src="getImgUrl(item?.url)"></van-image>
      </van-swipe-item>
    </van-swipe>
    <!-- user -->
    <div class="m-col">
      <div class="m-row" v-if="store.getUser() === null">
        <span>{{ $t('main.noLogin') }}</span>
        <span class="m-link" @click.stop="loginHandler">{{
          $t('main.loginCheck')
        }}</span>
      </div>
      <div class="m-row" v-else>
        <div class="m-row m-user">
          <span>{{ store.getUser()?.name ?? '' }}</span>
          <div class="m-user-level">
            <!-- <van-image :src="levelImg" fit="cover" class="m-img"></van-image> -->
            <div class="m-img-bg">VIP</div>
            <span class="m-level-txt">{{ store.getUser()?.level }}</span>
          </div>
          <van-button
            v-if="1 == 2"
            type="danger"
            size="mini"
            class="m-btn"
            @click="signDailyHandler"
            >{{ $t('daliySign') }}</van-button
          >
        </div>
        <span
          >${{
            Number(store.getUser()?.money ?? '0.00') <= 0
              ? '0.00'
              : Number(store.getUser()?.money).toFixed(2)
          }}</span
        >
      </div>
      <div class="m-row">
        <div class="m-row-item m-start" @click="operatHandler(1)">
          <van-image :src="depositImg" fit="contain" class="m-img"></van-image>
          <span class="m-label">{{ $t('mine.deposit') }}</span>
        </div>
        <div class="m-row-item" @click="operatHandler(2)">
          <van-image :src="withdrawImg" fit="contain" class="m-img"></van-image>
          <span class="m-label">{{ $t('mine.withdraw') }}</span>
        </div>
        <div class="m-row-item m-end" @click="operatHandler(3)">
          <van-image :src="vipImg" fit="contain" class="m-img"></van-image>
          <span class="m-label">VIP</span>
        </div>
      </div>
    </div>
    <!-- main -->
    <div class="m-main-contain">
      <div class="m-con-left">
        <div class="m-scroll-wrapper">
          <div class="m-scroll-content">
            <div class="m-scroll-list-wrapper">
              <div class="m-gameNav-container">
                <div
                  class="m-gameNav-item"
                  v-for="(item, idx) in games"
                  :key="idx"
                  :class="{ active: item.title == selectType?.title }"
                  :style="{
                    background:
                      idx > selectIdx
                        ? '-webkit-linear-gradient(90deg, #ccd7ed, #e0e4eb)'
                        : '',
                  }"
                  @click.stop="selectGameHandler(item, idx)"
                >
                  <van-image
                    :src="
                      getImgUrl(
                        selectType?.title == item?.title
                          ? (item?.icon_after ?? '')
                          : (item?.icon_before ?? ''),
                      )
                    "
                    class="m-item-img"
                  ></van-image>
                  <div class="m-item-txt">{{ item?.title ?? '' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-con-right">
        <div class="m-scroll-wrapper">
          <div class="m-scroll-content">
            <div class="m-scroll-list-wrapper">
              <div class="m-gameNav-container-list">
                <div
                  class="m-nav-list-item"
                  v-for="(item, idx) in filteredGameList()"
                  :key="idx"
                  @click.stop="playGameHandler(item)"
                >
                  <van-image
                    :src="getImgUrl(item?.mobile_pic ?? '')"
                    class="m-item-img"
                    fit="fill"
                  >
                    <template v-slot:error
                      ><van-icon name="warning-o" class="m-ico" size="22"
                    /></template>
                  </van-image>
                  <div class="m-item-txt">{{ item?.title ?? '' }}</div>
                  <div class="m-item-tag">{{ item?.game_type_text ?? '' }}</div>
                  <div
                    class="m-item-show m-up"
                    v-if="(item?.is_show ?? 0) === 10"
                  >
                    {{ $t('weiHuZhong') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NoticesPop />
    <!-- footer -->
    <div class="m-main-footer"></div>
  </div>
</template>

<script setup lang="ts">
// import levelImg from '@/assets/mobile/leve_logo.png'
import depositImg from '@/assets/mobile/deposit.png'
import withdrawImg from '@/assets/mobile/withdraw.png'
import vipImg from '@/assets/mobile/home_vip.png'

defineOptions({ name: 'HomeMain' })
import { onMounted, ref } from 'vue'
import LanguageVue from './components/language.vue'
import api from '@/api'
import { getImgUrl, invokeApi, isMobile2 } from '@/utils/tools'
import { showNotify, showToast } from 'vant'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import type { ApiGameType } from 'typings/api'
import NoticesPop from '@/views/mobile/components/notices.vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const store = useAppStore()
interface banner {
  dimensions: string
  groups: string
  is_new_window: number
  jump_link: string
  title: string
  url: string
  weight: number
}
interface Params {
  gameCode: string
}
interface child {
  title: string
  game_type: number
  mobile_pic: string
  tags: string
  params: string
  api_name: string
  weight: number
  game_type_text: string
  game_type_cn_text: string
  is_show: number
}
interface game {
  title: string
  icon_before: string
  icon_after: string
  child: child[]
}
const banners = ref<banner[]>([])
const games = ref<game[]>([])
const selectType = ref<game | null>(null)
const gameType = ref<ApiGameType[]>([])
const { t } = useI18n()
const showGames: string[] = []
const selectIdx = ref(6)

const filteredGameList = () => {
  const list = (selectType.value?.child ?? []).filter(it => {
    return showGames.length > 0
      ? (showGames.includes(it?.api_name ?? '') ?? false)
      : true
  })
  return list
}
//游戏
function playGameHandler(n: child) {
  const ele = n.game_type === 3 && n.api_name === 'PA'
  if ((ele || n.game_type != 3) && !store.isLogin()) {
    loginHandler()
    return
  }
  if ((n?.is_show ?? -1) === 0) {
    showNotify({
      type: 'primary',
      // color: '#000000',
      background: ' rgb(25, 137, 250)',
      message: t('weiHuZhong'),
    })
    return
  }
  // console.log('n=', n, gameType.value)
  const gt: ApiGameType[] = gameType.value.filter(it => it.key === n.game_type)
  console.log('gt=', gt, n)
  if (gt.length > 0 && gt[0].isLobbyPage == true && n.api_name !== 'PA') {
    router.push({
      name: 'game',
      params: {
        name: n.api_name,
        type: n.game_type,
      },
      query: {
        name: n.title,
      },
    })
    return
  }
  // console.log('nnnn', n)
  if (n.params.length == 0) {
    n.params = '{}'
  }
  const pa: Params = JSON.parse(n.params)
  router.push({
    name: 'to_game',
    params: {
      game: pa?.gameCode ?? 0,
      code: n.api_name,
      mobile: isMobile2() ? 1 : 0,
    },
  })
}
//登录
function loginHandler() {
  store.$patch({ loginShow: true })
  console.log('login show', store.getUser(), store.loginShow)
}
// 获取notices
async function getNotices() {}
//获取banner图
async function getBanners() {
  try {
    const resp = await api.banners({ group: 'mobile1' })
    console.log('banner resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      banners.value = resp.data
      if (banners.value.length >= 1) {
        banners.value.push(resp.data[0])
      }
    }
  } catch (err) {
    console.log('e', err)
    const msg = (err as Error).message
    if (msg && msg.length > 0) {
      showToast(msg)
    }
  }
}
//获取游戏类别
async function getGameTypes() {
  const resp = await invokeApi('gameTypes')
  if (!resp) {
    return
  }
  gameType.value = resp.data as ApiGameType[]
}
//获取游戏信息
async function getGames() {
  try {
    const resp = await api.games()
    console.log('games resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      games.value = resp.data
      selectType.value = resp.data[0]
    } else {
      showToast(resp.message)
    }
  } catch (e) {
    // showToast(e.message)
    console.log(e)
  }
}
// 签到
function signDailyHandler() {}
// 存/取款及vip
function operatHandler(n: number) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }
  switch (n) {
    case 1:
      router.push({ name: 'deposit' })
      break
    case 2:
      router.push({ name: 'withdraw' })
      break
    case 3:
      router.push({ name: 'vip' })
      break
  }
}
// init
async function init() {
  store.$patch({ loginShow: false })
  store.loading()
  await getNotices()
  await getBanners()
  await getGameTypes()
  await getGames()
  if (store.getUser()) {
    await store.getMeForApi()
  }

  store.stopLoad()
}

function selectGameHandler(n: game, idx: number) {
  console.log('selectGameHandler', n, idx)
  if (idx <= selectIdx.value) {
    selectType.value = n
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
.m-main {
  // background: #f5f6f7;
  background: var(--color-m-background);
  height: 100vh;
  display: flex;
  flex-direction: column;
  .my-swipe {
    height: 140px;
    .van-swipe-item {
      color: var(--m-label-gb);
      font-size: 20px;
      height: 140px;
      text-align: center;
      background-color: #39a9ed;
    }
  }
  .m-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 16px;
    color: var(--van-field-label-color);
    background: var(--color-m-background);
    box-shadow:
      0 0.08rem 0.32rem 0 rgba(209, 221, 242, 0.4),
      0 -0.05333rem 0 0 hsla(0, 0%, 100%, 0.5);
    border-radius: 0 0 0.13333rem 0.13333rem;
    .m-link {
      color: #3ea4f7;
    }
  }
  .m-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 16px;

    .m-row-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      flex: 1;
      gap: 5px;
      .m-img {
        width: 34px;
        height: 32px;
      }
      .m-label {
        color: var(--m-label-gb);
        font-size: 16px;
      }
    }
    .m-start {
      justify-content: flex-start;
    }
    .m-end {
      justify-content: flex-end;
    }
  }
  .m-user {
    gap: 10px;
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
    .m-btn {
      height: 20px;
    }
  }

  .m-main-contain {
    display: flex;
    flex-direction: row;
    flex: 1;
    height: calc(100vh - 270px);
    background-color: var(--color-m-background);

    gap: 10px;
    .m-con-left {
      display: flex;
      flex-direction: column;
      width: 70px;
      height: 100%;
      background-color: var(--color-m-background);
      // background-image: -webkit-linear-gradient(90deg, #f4f6fa, #f5f7fa);
      background-image: var(--m-label-gb);
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: 60px 95%;

      .m-gameNav-container {
        padding-top: 10px;
        padding-bottom: 10px;

        .m-gameNav-item {
          width: 60px;
          height: 67.5px;
          // background: -webkit-linear-gradient(90deg, #f4f6fa, #f5f7fa);
          // background: linear-gradient(1turn, #f4f6fa, #f5f7fa);
          background-image: var(--m-label-gb);
          box-shadow: 0 0.08rem 0.32rem 0 rgba(209, 221, 242, 0.5);
          font-size: 14px;
          -webkit-transition: 0.35s ease;
          transition: 0.35s ease;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -webkit-flex-direction: column;
          -ms-flex-direction: column;
          flex-direction: column;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -webkit-justify-content: center;
          -ms-flex-pack: center;
          justify-content: center;
          text-align: center;
          color: var(--m-left-menu-color);

          .m-item-img {
            width: 24px;
            height: 24px;
          }
          .m-item-txt {
            font-size: 10px;
          }
        }
        .active {
          width: 69.5px;
          height: 76.5px;
          color: #fff;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          background-image: url('../../../assets/mobile/nav_active.png');
          box-shadow: none;
        }
      }
    }
    .m-con-right {
      display: flex;
      flex-direction: column;
      flex: 1;

      .m-gameNav-container-list {
        padding: 10px 10px 10px 0px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 9px;
        .m-nav-list-item {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 5px;
          justify-content: space-between;
          align-items: flex-start;
          width: 138px;
          height: 108px;
          background: var(--m-main-img-item-bg-color);
          box-shadow: 0 0 0 2px rgb(0 0 0 / 5%);
          border-radius: 2px;
          .m-item-img {
            width: 137.7px;
            height: 80px;
          }
          .m-item-txt {
            color: var(--m-left-menu-color);
            font-size: 12px;
            line-height: 18px;
            margin-left: 5px;
            margin-bottom: 5px;
          }
          .m-item-tag {
            position: absolute;
            right: 5px;
            top: 5px;
            font-size: 12px;
            color: #fff;
            background: rgba(0, 0, 0, 0.25);
            border-radius: 3px;
            padding: 2px 5px;
          }
          .m-item-show {
            position: absolute;
            // top: 0px;
            min-height: 20px;
            left: 0px;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            color: greenyellow;
            cursor: not-allowed;
          }
          &:hover {
            .m-up {
              top: 0;
            }
          }
        }
      }
    }
    .m-scroll-wrapper {
      position: relative;
      height: 100%;
      overflow-y: scroll;

      .m-scroll-content {
        position: relative;
        .m-scroll-list-wrapper {
          overflow: hidden;
        }
      }
    }
  }
  .m-main-footer {
    display: flex;
    height: 50px;
  }
}
</style>
<style lang="less">
.m-main {
  ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
  }
}
</style>
