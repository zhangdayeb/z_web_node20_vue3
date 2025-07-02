<template>
  <div class="m-activity">
    <van-nav-bar
      left-arrow
      :title="$t('activity_detail')"
      @click-left="onClickLeft"
    />
    <div class="m-html-container" v-html="html"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { api2 } from '@/api'
import { showToast } from 'vant'
import { useAppStore } from '@/stores/app'
defineOptions({ name: 'ActivityDetail' })

const store = useAppStore()
const route = useRoute()
const router = useRouter()
console.log('id=', route.params.id)
const html = ref('')

async function getActivityDetail() {
  store.loading()
  try {
    const id = route.params?.id ?? '0'
    const resp = await api2.activity(id.toString(), { id: id })
    console.log('>>>>activity resp:', resp)
    if (resp) {
      console.log(resp)
      if (typeof resp === 'string') {
        html.value = resp
      }
    }
  } catch (err) {
    console.log(err)
    showToast((err as Error).message)
  }
  store.stopLoad()
}

function onClickLeft() {
  router.back()
}
onMounted(async () => {
  await getActivityDetail()
})
</script>

<style lang="less" scoped>
.m-activity {
  display: flex;
  flex-direction: column;

  .m-html-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 16px;
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
.m-html-container {
  img {
    // width: 100% !important;
    max-width: 99% !important;
    object-fit: cover;
  }
}
</style>
