<template>
  <van-popup
    class="m-notices"
    v-model:show="showCenter"
    :close-on-click-overlay="false"
    :closeable="true"
  >
    <van-swipe :autoplay="10000" lazy-render>
      <van-swipe-item
        v-for="(item, idx) in notices"
        :key="idx"
        @click="clickNoticeHandler(item)"
        class="m-swipe-item"
      >
        <h3 class="m-title">{{ item.title }}</h3>
        <template v-if="item.type === 'img'">
          <van-image
            :src="getImgUrl(item.content)"
            fit="contain"
            class="m-img"
          ></van-image>
        </template>
        <template v-else>
          <div class="m-text">
            <div class="m-content" v-html="item.content"></div>
          </div>
        </template>
      </van-swipe-item>
    </van-swipe>
    <div class="m-see">
      <van-checkbox
        v-model="checked"
        shape="square"
        icon-size="14"
        @change="todayNoDsiplay"
        >{{ $t('todayDoNotShow') }}</van-checkbox
      >
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { getImgUrl, invokeApi } from '@/utils/tools'
import dayjs from 'dayjs'
import type { ApiNotice } from 'typings'
import { onMounted, ref } from 'vue'

defineOptions({ name: 'NoticesPop' })

const showCenter = ref(false)
const notices = ref<ApiNotice[]>()
const checked = ref(false)
const showKey = 'dontShowNotice'

function todayNoDsiplay(b: boolean) {
  if (b) {
    localStorage.setItem(showKey, `${dayjs().endOf('day').unix()}`)
  } else {
    localStorage.removeItem(showKey)
  }
}

function isShowPopup() {
  const it = Number(localStorage.getItem(showKey))
  console.log('it', it)

  return it <= 0 || it <= Math.ceil(dayjs().unix())
}

function clickNoticeHandler(it: ApiNotice) {
  if (it.url) {
    window.location.href = it.url
  }
}

async function getNotices() {
  const resp = await invokeApi('notices', { isMobile: 1 }, '', false)
  if (resp) {
    const data: ApiNotice[] = resp.data as ApiNotice[]
    const alerts: ApiNotice[] = resp.alert
    const tmp: ApiNotice[] = []
    alerts.forEach(it => {
      tmp.push({ ...it, type: 'img' })
    })

    data.forEach(it => {
      tmp.push({ ...it, type: 'txt' })
    })
    notices.value = tmp
    if (tmp.length > 0 && isShowPopup()) {
      // showCenter.value = true
    }
  }
}

onMounted(async () => {
  await getNotices()
})
</script>

<style lang="less" scoped>
.m-notices {
  // position: relative;
  display: flex;
  flex-direction: column;
  min-height: 50%;
  height: 480px;
  margin: 0 auto;
  width: 100%;
  border-radius: 10px;
  overflow: inherit;

  .m-swipe-item {
    display: flex;
    flex-direction: column;
  }
  .m-title {
    text-align: center;
    padding: 15px 0;
    font-size: 15px;
    font-weight: 600;
  }
  .m-img {
    width: 100%;
    height: 100%;
  }
  .m-text {
    padding: 10px 16px 0px 16px;
    margin-bottom: 10px;
    box-sizing: border-box;
    flex: 1;
    height: calc(100% - 60px);
    overflow-x: hidden;
    overflow-y: auto;

    .m-content {
      width: 100%;
      height: auto;
      font-size: 12px;
      line-height: 20px;
    }
  }

  .m-see {
    position: absolute;
    bottom: -40px;
    font-size: 12px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
<style lang="less">
.m-see {
  .van-checkbox {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 5px 10px;

    .van-checkbox__label {
      color: #fff;
    }
  }
}
</style>
