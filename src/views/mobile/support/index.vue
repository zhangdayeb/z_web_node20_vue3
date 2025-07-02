<template>
  <div class="m-support">
    <div class="m-header">
      <van-image
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAABHVBMVEUAAADx8fHw8PDx8fHw8PDx8fHy8vLy8vLw8PDx8fHw8PDz8/Pw8PD////y8vL////4tgDx8fHw8PDx8fHw8PDx8fHx8fHw8PD19fX////////4tgD4tgD4tgD/vxX4twT3tQD4tgD4tgD4tgD4twD6uQD/ugDy6Mz3zFnw8PD++fJmZmb3tQD79/L08/Hn49349fGNjYx3d3dwcHDo6OeRkZDf29W6ubilpKObmpp9fX1ra2vf39/Z2dn2wzXv7uv18Orj4+Pk39rX1NHQzMjFwr63tbOVlZOCgoH303Xx7N7Pz8+/v7+vrq2qqaj42YaHh4b0zWPx6M3Kysr868Dy5L7y3qafn57535bz2ZD1yU32vyb2uhTr5uD3xkCgIOjOAAAAKXRSTlMA+fDs0rBzY8ySVUIiBjwE7effuYltWzMaDAixc14K0uffuYltMxrSPO+PXkkAAANcSURBVFjDnNXrTupQEAXg6R1FMNyFN1idGAKlUApGAbkkKDHxx3n/Nzmn5Fj2YLtb/R5gMpe1W9LpeW3HblqGYTVtp+316DceOo6JK6bTeaAfGXRbyNHqDqisvtuARsPtUxn3roUClntPheo2SrDrpFe7QUk3NdK4q+Da5DiL5uFoFO7np9nnBKnKHeWqmpCeTgeW4ve0llmlHLcGhLcDZ1i84T/jljJ5V918cI60ErzMfuRqIs41Riqjp6qYaxmzxgpfjOq3e5lirDHrLJEyr25XE3ffBKwzhqIi8yRyuApYK5TJFO8CqhEXCOYrXNSVd2pD8c7Fxsqa7MsLdsWiuYwYF276/bGgmHMpn0hZ/ayGllxO+L2lQUPfUHEGGgNKdKEKuCQoupRoQXHkstQEtM7/HagiLmsJRfKX6mSG8WO7ed2FfGWx3w6HuwUnJlB0iMiBKuazyD972YbBV414v9s8+olXTjxD4RCRmbHrkX/xvJ5O18MXX3FICkNlEvWQUWjoa0Xn8ws98iCM+Z+5rzdLmobgUTuj0NTXOi8pgtAmB0IyfuwX2DDzDIJDNoTk4ie/wJSZnyDY1ITwJ51MY80cQGqSBWHHvHj0CwyZ95AsMiAc0xDpC80gGX9bMZuehIEgDPciJJhgjUSJ/eJbu92tPRC9FQ56aBNTSwD50v//M0QCWfua7qyNz609PNmdaWdnFkXjIHjVEY1RhFvz34JnWvS9atgaBDtkT8EDo4P9wlhUDDakX7DpIyP5eJ8yJiD9ZyDSRsAH2fofUcuoVxVF8NPeVBVBGYHCFmp7BBa2itEW8PND8QcT4YHi34Z3odAJNNDGA/LA3z1XxyMbiMiEIdfQRGjGKfSBy9tTW4MQG0NqstECQr2EYaOFS0ITepBaoRlFBBEfaEahPaYWJaRH0oSG/TeRYjnQsOMIgYSKbMEIAUMNovgMYaiBMUtfJMcspFFF1CgZRYFFnklPls98pK4zHKfZlnMez9mB+ef+YbMo7qtBj+uT5YYfiZPVKolPD8sfcT4nLxBmyY6XsV1P5AWC8kojXcdcyS5J5ZVGOfcep8nvmgaNbVIe074wdHDtjkrTsV1DF9fplWl6DmgoRgPLRIlpDUZGFYZO3/K65t7Q9ay+MzQUfAEQtKHkDLdyiwAAAABJRU5ErkJggg=="
        fit="contain"
        class="m-avatar"
      ></van-image>
      <div class="m-header-right">
        <h5 class="m-title">Hi,</h5>
        <span class="m-sub-title">{{ $t('support.welcome') }}</span>
      </div>
    </div>
    <div class="m-kf">
      <van-cell :is-link="true" class="m-cell" @click="goServiceHandler">
        <template #title>
          <div class="m-col">
            <div class="m-title">{{ $t('support.mainCustom') }}</div>
            <div class="m-subtitle">{{ $t('support.agentCoustom') }}</div>
            <div class="m-label">
              <span>7*24 </span><span>{{ $t('support.serviceTop') }}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useAppStore } from '@/stores/app'
import { getDomain } from '@/utils/tools'
import api from '@/api'

defineOptions({ name: 'SupportIndex' })
interface serviceInfo {
  service_link: string
  kefu_wechat_qrcode: string
  kefu_qq: string
}
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const serviceInfo = ref<serviceInfo | null>(null)

function goServiceHandler() {
  if (!serviceInfo.value || serviceInfo.value.service_link.length === 0) {
    return
  }
  window.open(serviceInfo.value.service_link)
}
async function serviceLink() {
  store.loading()
  try {
    const resp = await api.sysConfig({
      group: 'service',
      is_mobile: 1,
      url: getDomain(),
    })
    console.log('service config resp:', resp)
    if (resp && resp.code === 200 && resp.data) {
      serviceInfo.value = resp.data
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    console.log(err)
    showToast((err as Error).message)
  }
  store.stopLoad()
}
onMounted(async () => {
  await serviceLink()
})
</script>
<style lang="less" scoped>
.m-support {
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);

  .m-header {
    padding: 40px 34px 86px 34px;
    background-image: url('../../../assets/mobile/support_user_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
    .m-avatar {
      width: 50px;
      height: 50px;
    }
    .m-header-right {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;
      .m-title {
        margin: 0px;
        color: #333;
        font-weight: 700;
        font-size: 16px;
        line-height: 22px;
      }
      .m-sub-title {
        color: #95a2b4;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }

  .m-kf {
    height: 150px;
    margin: -59px 16px 0px 16px;
    padding: 20px 20px 50px 20px;
    background-image: url('../../../assets/mobile/kf_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .m-cell {
      padding: 0px;
    }
    .m-col {
      display: flex;
      flex-direction: column;
      height: 80px;
      flex: 1;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: nowrap;

      .m-title {
        font-size: 20px;
        font-weight: 400;
      }
      .m-subtitle {
        font-size: 14px;
        opacity: 0.6;
      }
      .m-label {
        font-size: 14px;
      }
    }
  }
}
</style>
<style lang="less">
.m-support {
  .van-cell {
    background-color: transparent;
    color: #fff;
    align-items: center;

    .van-cell__right-icon {
      color: #fff;
      font-size: 22px;
    }
  }
}
</style>
