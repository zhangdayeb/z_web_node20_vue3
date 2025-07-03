<template>
  <div class="m-game-list">
    <loginPop />
    <van-nav-bar left-arrow :title="title" @click-left="onClickLeft" />
    <div class="m-game-container">
      <div class="m-game-nav">
        <div
          class="m-nav-item"
          :class="{ active: selectType === -1 }"
          @click.stop="selectTypeHandler(-1)"
        >
          <van-image :src="scImg" fit="cover" class="m-item-img"></van-image>
          <div class="m-item-label">{{ $t('game.myCollection') }}</div>
        </div>
        <div
          class="m-nav-item"
          v-for="(item, idx) in gameTypes"
          :key="idx"
          :class="{ active: selectType === idx }"
          @click.stop="selectTypeHandler(idx)"
        >
          <van-image
            :src="getImgUrl(item?.web_pic ?? '')"
            fit="cover"
            class="m-item-img"
          ></van-image>
          <div class="m-item-label">{{ item?.title }}</div>
        </div>
      </div>
      <div class="m-games">
        <div class="m-game-tags"></div>
        <div class="m-games-scroll">
          <van-empty
            v-if="(games?.length ?? 0) <= 0"
            :description="$t('noData')"
          ></van-empty>
          <div class="m-game-lst" v-else>
            <div class="m-games-item" v-for="(item, idx) in games" :key="idx">
              <div class="m-gameCard-content" @click.stop="enterGame(item)">
                <van-image
                  :src="item?.img_url ?? ''"
                  class="m-item-img"
                  :lazy-load="true"
                >
                  <template v-slot:error
                    ><van-icon name="warning-o" class="m-ico" size="22"
                  /></template>
                </van-image>
                <div class="m-item-tag-bot">
                  <div class="m-tag">{{ item?.api_name ?? '' }}</div>
                </div>
              </div>
              <div class="m-item-footer">
                <span class="m-name">{{
                  getLanguage().startsWith('zh')
                    ? (item?.name ?? '')
                    : (item?.en_name ?? '')
                }}</span>
                <van-icon
                  :name="myGameIds.includes(item?.id ?? 0) ? 'star' : 'star-o'"
                  class="m-ico"
                  @click="collectGame(item)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import scImg from '@/assets/mobile/chc.png'
defineOptions({ name: 'GameList' })
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import { getImgUrl, invokeApi, isMobile } from '@/utils/tools'
import loginPop from '@/components/loginPop.vue'
import api from '@/api'
import { useI18n } from 'vue-i18n'
import type { gameType, gameInfo } from 'typings'
import { getLanguage } from '@/lang'

const { t } = useI18n()
const store = useAppStore()
const route = useRoute()
const router = useRouter()
console.log('route', route.query)

const title = ref<string>(route.query?.name?.toString() ?? '')
const currCode = ref(route.params.name)
const currTag = ref('all')
const currType = ref(Number(route.params.type))

const gameTypes = ref<gameType[]>([])
const selectType = ref(-1)
const games = ref<gameInfo[]>([])
const myGames = ref<gameInfo[]>([])
const myGameIds = ref<number[]>([])

//返回
function onClickLeft() {
  router.back()
}

// 收藏
async function collectGame(g: gameInfo) {
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }

  if (myGameIds.value.includes(g.id)) {
    await collectDelGame(g, false)
  } else {
    await collectAddGame(g, false)
  }
}

//收藏-添加
async function collectAddGame(g: gameInfo, isLoad: boolean = true) {
  store.loading()
  // console.log('collect game id', g)
  //{"game_type":3,"api_name":"AG","model_id":3586}
  const resp = await invokeApi(
    'favorAdd',
    {
      game_type: g.game_type,
      api_name: g.api_name,
      model_id: g.id,
    },
    '',
    isLoad,
  )
  if (!resp) {
    store.stopLoad()
    return
  }
  await getMyGames(isLoad)
  store.stopLoad()
  showToast(t('main.collectionSuccess'))
}

//收藏-删除
async function collectDelGame(g: gameInfo, isLoad: boolean = true) {
  store.loading()
  const resp = await invokeApi(
    'favorDelete',
    {
      game_type: g.game_type,
      api_name: g.api_name,
      model_id: g.id,
    },
    '',
    isLoad,
  )
  if (!resp) {
    store.stopLoad()
    return
  }
  await getMyGames(isLoad)
  store.stopLoad()
  showToast({
    message: t('success'),
    onClose: async () => {},
  })
}

// 进入游戏
function enterGame(game: gameInfo) {
  console.log('game', game)
  if (!store.isLogin()) {
    store.$patch({ loginShow: true })
    return
  }

  router.push({
    name: 'to_game',
    params: {
      game: game.game_code,
      code: game.api_name,
      mobile: isMobile() ? 1 : 0,
    },
  })
}

//选择游戏分类
async function selectTypeHandler(n: number) {
  console.log('selectTypeHandler.n=', n)
  selectType.value = n
  if (n === -1) {
    games.value = myGames.value
    return
  }
  const item = gameTypes.value[n]
  if (!item) {
    return
  }

  currType.value = item?.game_type ?? route.params.type
  currCode.value = item?.api_name ?? ''
  currTag.value = 'all'

  store.loading()
  await gameList()
  store.stopLoad()
}
// game types
async function getGameTypes() {
  try {
    const resp = await api.gameApi({ gameType: route.params.type })
    console.log('game api resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      gameTypes.value = resp.data.filter(item => item.api_name !== 'PA')
      gameTypes.value.forEach((item, idx) => {
        if (item.api_name === currCode.value) {
          selectType.value = idx
        }
      })
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    showToast((err as Error)?.message ?? 'api failed')
  }
}
// game list
async function gameList() {
  try {
    const resp = await api.gameList({
      gameType: currType.value,
      api_code: currCode.value,
      tag: currTag.value,
      isMobile: isMobile() ? 1 : 0,
      keyword: '',
    })
    console.log('game list resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      games.value = resp.data
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    showToast((err as Error)?.message ?? 'api failed')
  }
}

//我的收藏
async function getMyGames(isLoad: boolean = true) {
  const resp = await invokeApi('favorList', {}, '', isLoad)
  if (!resp) {
    return
  }

  const gamelist: gameInfo[] = resp.gamelists as gameInfo[]
  if (gamelist.length > 0) {
    myGames.value = resp.gamelists as gameInfo[]
    const tmp: number[] = []
    myGames.value.forEach(it => {
      tmp.push(it.id)
    })
    myGameIds.value = tmp
    console.log('list', myGames.value)
  }
}

// init
async function init() {
  store.loading()
  await getGameTypes()
  await gameList()
  if (!store.isLogin()) {
    // store.$patch({ loginShow: true })
    store.stopLoad()
    return
  }
  await getMyGames(false)
  store.stopLoad()
}

onMounted(async () => {
  await init()
})
</script>

<style lang="less" scoped>
.m-game-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  background: #f5f6f7;
  .m-game-container {
    height: calc(100% - 46px);
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .m-game-nav {
      padding-bottom: 10px;
      display: flex;
      flex-direction: column;
      width: 80px;
      overflow-y: auto;
      background-color: #fff;
      .m-nav-item {
        padding-top: 10px;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 7px;
        align-items: center;

        .m-item-img {
          width: 30px;
          height: 30px;
          background: -webkit-linear-gradient(top, #92d3ff, #4fabff);
          background: linear-gradient(180deg, #92d3ff, #4fabff);
          border-radius: 3px;
        }
        .m-item-label {
          width: 60px;
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .active {
        background: #f6f6f6;
      }
    }
    .m-games {
      padding: 10px;
      display: flex;
      width: 100%;
      flex-direction: column;
      gap: 10px;
      height: 100%;

      .m-games-scroll {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 100%;
        overflow-y: scroll;
        .m-game-lst {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;

          .m-games-item {
            width: 100%;
            overflow: hidden;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0.16rem 0.26667rem -0.18667rem rgba(112, 177, 253, 0.46);

            .m-gameCard-content {
              width: 100%;
              padding-bottom: 100%;
              border-radius: 5px;
              overflow: hidden;
              position: relative;

              .m-item-img {
                position: absolute;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
              }
              .m-item-tag-bot {
                position: absolute;
                z-index: 1;
                bottom: 0;
                width: 100%;
                padding: 0 5px 5px 5px;
                color: #fff;
                font-size: 12px;
                display: -webkit-box;
                display: -webkit-flex;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: end;
                -webkit-align-items: flex-end;
                -ms-flex-align: end;
                align-items: flex-end;
                height: 50%;
                background-image: -webkit-linear-gradient(
                  bottom,
                  rgba(0, 0, 0, 0.7),
                  transparent 60%
                );
                background-image: linear-gradient(
                  0deg,
                  rgba(0, 0, 0, 0.7),
                  transparent 60%
                );

                .m-tag {
                  background: #28cb93;
                  margin-right: 5px;
                  line-height: 18px;
                  height: 18px;
                  padding: 0 4px;
                  border-radius: 4px;
                }
              }
            }

            .m-item-footer {
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -webkit-align-items: center;
              -ms-flex-align: center;
              align-items: center;
              justify-content: space-between;
              height: 30px;

              .m-name {
                font-size: 14px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
                white-space: nowrap;
                max-width: 120px;
                overflow: hidden;
              }
              .m-ico {
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ff6363;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
.m-game-list {
  ::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
  }
}
</style>
