<template>
  <div class="m-exten">
    <van-nav-bar
      left-arrow
      :title="$t('mine.tuiguanG')"
      @click-left="onClickLeft"
      class="m-nav"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'ExtensionVue' })

const router = useRouter()

//返回
function onClickLeft() {
  router.back()
}
</script>

<style lang="less" scoped>
.m-exten {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
</style>
