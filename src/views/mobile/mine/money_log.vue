<template>
  <div class="m-money-log">
    <van-nav-bar
      left-arrow
      :title="$t('mine.moneyLog')"
      @click-left="onClickLeft"
      class="m-nav"
    />
    <!-- 统计 -->
    <div class="m-static">
      <div class="m-col m-static-item">
        <span>{{ statistic.sum_money }}</span>
        <h5>{{ $t('mine.moneyLogAmount') }}</h5>
      </div>
      <div class="m-col m-static-item">
        <span class="m-c-red">{{ statistic.valid_money }}</span>
        <h5>{{ $t('mine.validAmount') }}</h5>
      </div>
    </div>
    <!-- search -->
    <div class="m-search">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="search.created_at"
          :options="dateRangeList"
          title-class="m-drop-title"
          @change="dropItemChange"
        />
        <van-dropdown-item
          v-model="search.operate_type"
          :options="operateRangeList"
          title-class="m-drop-title"
          :title="$t('mine.operateType')"
          @change="dropItemChange"
        />
        <van-dropdown-item
          v-model="search.money_type"
          :options="moneyRangeList"
          title-class="m-drop-title"
          :title="$t('mine.walletType')"
          @change="dropItemChange"
        />
      </van-dropdown-menu>
      <!-- list -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          :immediate-check="false"
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('noMore')"
          @load="onLoad"
        >
          <van-cell
            v-for="item in list"
            :key="item.id"
            is-link
            :title="item.operate_type_text"
            :label="item.created_at"
            :value="item.money"
            value-class="m-c-red"
            @click="detailHandler(item)"
          />
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 底部弹出 -->
    <van-popup
      v-model:show="showBottom"
      position="bottom"
      closeable
      :style="{ height: '70%' }"
    >
      <van-cell-group :title="$t('moneyLog.detail')">
        <van-cell
          :title="$t('moneyLog.tradeMoney')"
          :value="selectItem?.money"
        />
        <van-cell
          :title="$t('moneyLog.beforeMoney')"
          :value="selectItem?.money_before"
        />
        <van-cell
          :title="$t('moneyLog.afterMoney')"
          :value="selectItem?.money_after"
        />
        <van-cell
          :title="$t('moneyLog.walletType')"
          :value="
            selectItem?.money_type === 'money'
              ? $t('mine.money')
              : $t('mine.fs_money')
          "
        />
        <van-cell
          :title="$t('moneyLog.transferType')"
          :value="selectItem?.operate_type_text"
        />
        <van-cell
          :title="$t('moneyLog.desc')"
          :value="selectItem?.description"
        />
        <van-cell
          :title="$t('moneyLog.tradeDate')"
          :value="selectItem?.created_at"
        />
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { useAppStore } from '@/stores/app'
import { getDateRange, invokeApi, getYestodayRange } from '@/utils/tools'
import type { ApiMoneyLogItem, ApiPageData, ApiStatistic } from 'typings/api'
defineOptions({ name: 'MoneyLog' })

const { t } = useI18n()
// const store = useAppStore()
const router = useRouter()
const search = ref({
  created_at: 1,
  money_type: '',
  operate_type: '',
})
const page = ref(0)
const total = ref(0)

const dateRangeList = ref([
  { text: t('mine.today'), value: 1 },
  { text: t('mine.yestoday'), value: 2 },
  { text: t('mine.week'), value: 3 },
  { text: t('mine.month'), value: 4 },
])
const operateRangeList = ref<{ text: string; value: string | number }[]>([])
const moneyRangeList = ref([
  { text: t('mine.all'), value: '' },
  { text: t('mine.fs_money'), value: 'fs_money' },
  { text: t('mine.money'), value: 'money' },
])
const statistic = ref<ApiStatistic>({
  sum_money: 0,
  valid_money: 0,
})
const list = ref<ApiMoneyLogItem[]>([])

const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const showBottom = ref(false)
const selectItem = ref<ApiMoneyLogItem>()

function detailHandler(it: ApiMoneyLogItem) {
  showBottom.value = true
  console.log('it=', it)
  selectItem.value = it
}
//下拉刷新
const onRefresh = async () => {
  finished.value = false
  loading.value = true
  page.value = 0
  await getMoneyLogs(installParams())
}

//list加载
const onLoad = async () => {
  await getMoneyLogs(installParams())
}
//search条件变更
async function dropItemChange(n: string | number) {
  console.log('n=', n)
  list.value = []
  await onRefresh()
}
//返回
function onClickLeft() {
  router.back()
}

//组装api请求参数
function installParams() {
  let tmp: string[] = []
  switch (Number(search.value.created_at)) {
    case 1:
      tmp = getDateRange(0)
      break
    case 2:
      tmp = getYestodayRange()
      break
    case 3:
      tmp = getDateRange(7)
      break
    case 4:
      tmp = getDateRange(30)
      break
  }
  return {
    page: page.value + 1,
    operate_type: search.value.operate_type,
    money_type: search.value.money_type,
    created_t: tmp,
  }
}

//金流记录
async function getMoneyLogs(d: object) {
  const resp = await invokeApi('moneyLog', d)
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }

  if (!resp) {
    loading.value = false
    return
  }

  if (
    resp.operate_type &&
    resp.operate_type.length > 0 &&
    operateRangeList.value.length === 0
  ) {
    const tmp: { text: string; value: string | number }[] = [
      { text: t('mine.all'), value: '' },
    ]
    resp.operate_type.forEach((item: { key: number; value: string }) => {
      tmp.push({ text: item?.value ?? '', value: item?.key ?? 0 })
    })
    if (tmp.length > 0) {
      operateRangeList.value = tmp
    }
  }
  if (resp.statistic && Object.keys(resp.statistic).length > 0) {
    const stat = resp.statistic as ApiStatistic
    statistic.value.sum_money = Number(stat?.sum_money ?? '0')
    statistic.value.valid_money = Number(stat?.valid_money ?? '0')
  }
  if (resp.data) {
    const data: ApiPageData<[]> = resp.data as ApiPageData<[]>
    page.value = data?.current_page ?? 1
    total.value = data?.total ?? 0
    list.value = list.value.concat(data?.data ?? [])

    if (list.value.length >= total.value) {
      finished.value = true
    }
  }
  loading.value = false
}

onMounted(async () => {
  await getMoneyLogs(installParams())
})
</script>

<style lang="less" scoped>
.m-money-log {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;

  .m-flex {
    flex: 1;
  }
  .m-align-cen {
    align-items: center;
  }
  .m-col {
    display: flex;
    flex-direction: column;
  }
  .m-row {
    display: flex;
    flex-direction: row;
  }
  .m-static {
    padding: 10px 16px;
    background-color: #fff;
    .m-row;
    justify-content: space-around;
    align-items: center;

    &-item {
      .m-flex;
      .m-align-cen;
      gap: 5px;

      h5 {
        font-size: 14px;
        color: #999;
        font-weight: 400;
      }
      span {
        font-size: 14px;
      }
    }
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
.m-search {
  .m-drop-title {
    font-size: 14px;
  }

  .van-cell--clickable {
    align-items: center;
  }
}
</style>
