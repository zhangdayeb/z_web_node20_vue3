<template>
  <div class="m-gift">
    <van-nav-bar :title="$t('youhuihuodong')" />
    <van-tabs v-model:active="active">
      <van-tab
        v-for="(item, idx) in tabs"
        :key="idx"
        :title="(item.title ?? '') === 'all' ? $t('all') : item.title"
      >
        <div class="m-tab-panel" v-if="idx === 0">
          <div
            class="m-tab-item"
            v-for="(it, ix) in list"
            :key="ix"
            @click="clickHandler(it)"
          >
            <van-image
              :src="getImgUrl(it.cover_image ?? '')"
              fit="contain"
              class="m-img"
            ></van-image>
            <div class="m-title">{{ it.title }}</div>
          </div>
        </div>
        <div class="m-tab-panel" v-else-if="idx == 1">
          <template v-for="(it, ix) in list">
            <div
              class="m-tab-item"
              :key="ix"
              v-if="it.type === item.value"
              @click="clickHandler(it)"
            >
              <van-image
                :src="getImgUrl(it.cover_image ?? '')"
                fit="contain"
                class="m-img"
              ></van-image>
              <div class="m-title">{{ it.title }}</div>
            </div>
          </template>
        </div>
        <div class="m-tab-panel" v-else-if="idx == 2">
          <template v-for="(it, ix) in list" :key="ix">
            <div
              class="m-tab-item"
              v-if="it.type === item.value"
              @click="clickHandler(it)"
            >
              <van-image
                :src="getImgUrl(it.cover_image ?? '')"
                fit="contain"
                class="m-img"
              ></van-image>
              <div class="m-title">{{ it.title }}</div>
            </div>
          </template>
        </div>
        <div class="m-tab-panel" v-else-if="idx == 3">
          <template v-for="(it, ix) in list" :key="ix">
            <div
              class="m-tab-item"
              v-if="it.type === item.value"
              @click="clickHandler(it)"
            >
              <van-image
                :src="getImgUrl(it.cover_image ?? '')"
                fit="contain"
                class="m-img"
              ></van-image>
              <div class="m-title">{{ it.title }}</div>
            </div>
          </template>
        </div>
      </van-tab>
    </van-tabs>
    <van-empty :description="$t('noRecord')" v-if="tabs.length <= 0" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/api'
import { getImgUrl } from '@/utils/tools'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
defineOptions({ name: 'GiftIndex' })

interface tabInfo {
  title: string
  value: number
}
interface activeInfo {
  cover_image: string
  id: number
  subtitle: string
  title: string
  type: number
  type_text: string
  weight: number
}
const router = useRouter()
const store = useAppStore()
const active = ref(0)
const tabs = ref<tabInfo[]>([])
const list = ref<activeInfo[]>([])

async function getActivities() {
  store.loading()
  try {
    const resp = await api.activities()
    console.log('activities resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      list.value = resp.data
      const tmp: tabInfo[] = []
      const arr: number[] = []
      list.value.forEach((item: activeInfo) => {
        if (!arr.includes(item.type)) {
          arr.push(item.type)
          tmp.push({ title: item.type_text, value: item.type })
        }
      })

      if (tmp.length > 0) {
        tabs.value = [{ value: -1, title: 'all' }, ...tmp]
      }
    }
  } catch (err) {
    console.log(err)
  }
  store.stopLoad()
}

function clickHandler(t: activeInfo) {
  console.log('tttt', t)
  router.push({ name: 'activity', params: { id: t.id } })
}
onMounted(async () => {
  await getActivities()
})
</script>
<style scoped lang="less">
.m-gift {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--color-m-background);
  .m-tab-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 0px;
    .m-tab-item {
      margin: 15px 0px 0px 0px;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      background: var(--m-label-gb);
      width: 100%;
      .m-img {
        height: 54px;
      }
      .m-title {
        margin: 15px 12px 15px 12px;
        color: var(--color-m-text);
      }
    }
  }
}
</style>
<style lang="less">
.m-gift {
  .van-tabs__nav--line {
    padding-bottom: 0px;
  }
  .van-tabs__line {
    bottom: 0px;
  }
}
</style>
