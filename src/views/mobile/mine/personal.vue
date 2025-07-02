<template>
  <div class="m-person">
    <van-nav-bar
      left-arrow
      :title="$t('mine.baseInfo')"
      @click-left="onClickLeft"
      class="m-nav"
    />
    <van-cell-group>
      <van-cell
        :title="$t('register.username')"
        :value="store.getUser()?.name ?? ''"
      />
    </van-cell-group>
    <van-cell-group class="m-top10">
      <van-cell
        :title="$t('register.realName')"
        :value="store.getUser()?.realname ?? ''"
      />
      <van-cell
        :title="$t('register.phone')"
        :value="store.getUser()?.phone ?? ''"
      />
      <van-cell
        :title="$t('register.email')"
        :value="store.getUser()?.email ?? ''"
      />
    </van-cell-group>

    <van-cell-group class="m-top10">
      <van-cell
        title="Facebook"
        :value="facebook"
        :is-link="(store.getUser()?.facebook ?? '').trim().length <= 0"
        @click="updateUserInfo('facebook')"
      />
      <van-cell
        title="Line"
        :value="line"
        :is-link="(store.getUser()?.line ?? '').trim().length <= 0"
        @click="updateUserInfo('line')"
      />
    </van-cell-group>
    <van-popup
      v-model:show="showBottom"
      position="bottom"
      closeable
      :style="{ height: '50%' }"
    >
      <van-cell-group inset class="m-pop-frm">
        <van-field
          v-model="frm.fb"
          label="Facebook"
          :rules="[{ required: true, message: $t('mine.inputPlz') }]"
          :placeholder="$t('mine.inputPlz')"
          v-if="selectField === 'facebook'"
        />
        <van-field
          v-model="frm.li"
          label="Line"
          :rules="[{ required: true, message: $t('mine.inputPlz') }]"
          :placeholder="$t('mine.inputPlz')"
          v-if="selectField === 'line'"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" @click="updateUserAction">
          {{ $t('submit') }}
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { invokeApi } from '@/utils/tools'
import { showToast } from 'vant'
defineOptions({ name: 'PersonalVue' })

const { t } = useI18n()
const store = useAppStore()
const router = useRouter()
// const getFillIn = () => t('fillIn')
const facebook = ref(store.getUser()?.facebook ?? '-')
const line = ref(store.getUser()?.line ?? '-')
const showBottom = ref(false)
const selectField = ref('')
const frm = ref({
  fb: '',
  li: '',
})
//返回
function onClickLeft() {
  router.back()
}

async function updateUserInfo(field: string) {
  switch (field) {
    case 'facebook':
      if ((store.getUser()?.facebook ?? '').trim().length <= 0) {
        selectField.value = field
        showBottom.value = true
      }
      break
    case 'line':
      if ((store.getUser()?.line ?? '').trim().length <= 0) {
        selectField.value = field
        showBottom.value = true
      }
      break
  }
}

async function updateUserAction() {
  let data = {}
  switch (selectField.value) {
    case 'facebook':
      if (frm.value.fb.trim().length <= 0) {
        showToast(t('mine.inputPlz'))
        return
      }
      data = { facebook: frm.value.fb }
      break
    case 'line':
      if (frm.value.li.trim().length <= 0) {
        showToast(t('mine.inputPlz'))
        return
      }
      data = { line: frm.value.li }
      break
  }

  if (Object.keys(data).length > 0) {
    const resp = await invokeApi('updateMeInfo', data)
    if (!resp) {
      return
    }
    const user = store.getUser()
    if (user) {
      store.setUser({ ...user, ...data })
    }
    showBottom.value = false
  }
}
</script>

<style lang="less" scoped>
.m-person {
  display: flex;
  flex-direction: column;
  flex: 1;

  .m-top10 {
    margin-top: 10px;
  }
  .m-pop-frm {
    margin-top: 46px;
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
</style>
