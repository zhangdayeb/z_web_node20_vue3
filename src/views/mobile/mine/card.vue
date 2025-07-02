<template>
  <div class="m-card">
    <van-nav-bar
      left-arrow
      :title="$t('mine.bankManage')"
      @click-left="onClickLeft"
    />
    <div class="m-card-contain">
      <div class="m-bank-list">
        <!-- v-for="(item, idx) in list" :key="idx" -->
        <div class="m-bank-item" v-for="(item, idx) in list" :key="idx">
          <div class="m-bank-info">
            <div class="m-bank-name">{{ item?.bank_type_text ?? '' }}</div>
            <div class="m-btn-edit" @click="editCardHandler(item)">
              {{ $t('mine.edit') }}
            </div>
          </div>
          <div class="m-bank-card">{{ item?.card_no ?? '' }}</div>
        </div>
      </div>
      <van-button
        type="primary"
        size="large"
        round
        class="m-btn-add"
        @click.stop="addBindHandler"
        >{{ $t('mine.addBind') }}</van-button
      >
    </div>
    <van-popup
      v-model:show="showBottom"
      position="bottom"
      :style="{ height: '60%' }"
      class="m-card-pop"
    >
      <van-tabs v-model:active="active" @click-tab="onClickTab">
        <van-tab title="银行卡">
          <div class="m-tab-contain">
            <van-cell-group inset style="margin-left: 0px; margin-right: 0">
              <van-field label="开户银行" input-align="right" required>
                <template #input>
                  <van-dropdown-menu>
                    <van-dropdown-item
                      v-model="frm.bank_type"
                      :options="bankList ?? []"
                    />
                  </van-dropdown-menu>
                </template>
              </van-field>
              <van-field
                v-model="frm.owner_name"
                type="text"
                label="开户人姓名"
                input-align="right"
                required
                :readonly="frm.owner_name.length > 0"
                placeholder="请输入开户人姓名(仅可修改一次)"
              />
              <van-field
                v-model="frm.card_no"
                type="digit"
                input-align="right"
                label="银行账号"
                required
                placeholder="请输入开户银行账号"
              />
              <van-field
                v-model="frm.bank_address"
                type="text"
                input-align="right"
                label="开户网点"
                placeholder="请输入开户网点"
              />
            </van-cell-group>

            <div class="m-btns">
              <van-button
                type="primary"
                size="small"
                class="m-btn"
                round
                block
                @click="submitBankHandler"
                >提交</van-button
              >
            </div>
          </div>
        </van-tab>
        <van-tab title="USDT">
          <div class="m-tab-contain">
            <van-cell-group inset style="margin-left: 0px; margin-right: 0">
              <van-field label="钱包类别" :required="true" input-align="right">
                <template #input>
                  <van-dropdown-menu>
                    <van-dropdown-item
                      v-model="frm.walletType"
                      :options="coinList ?? []"
                    />
                  </van-dropdown-menu>
                </template>
              </van-field>
              <van-field
                v-model="frm.owner_name"
                type="text"
                label="开户人姓名"
                input-align="right"
                :readonly="frm.owner_name.length > 0"
                placeholder="请输入开户人姓名(仅可修改一次)"
              />
              <van-field
                v-model="frm.card_no"
                type="text"
                label="钱包地址"
                name="钱包地址"
                :required="true"
                input-align="right"
                placeholder="请输入钱包地址"
              />
            </van-cell-group>

            <div class="m-btns">
              <van-button
                type="primary"
                size="small"
                class="m-btn"
                round
                block
                @click="submitCoinHandler"
                >提交</van-button
              >
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import api, { api2 } from '@/api'
import { showToast, type DropdownItemOption } from 'vant'
import type { ApiMemberBank } from 'typings'

defineOptions({ name: 'WithdrawVue' })

const router = useRouter()
const store = useAppStore()
const list = ref<ApiMemberBank[] | null>(null)
const bankList = ref<DropdownItemOption[] | null>(null)
const coinList = ref<DropdownItemOption[] | null>(null)
const showBottom = ref(false)
const active = ref(0)
const coinType = ref('')
const editId = ref(0)

const frm = ref({
  bank_type: '',
  owner_name: store.getUser()?.realname ?? '',
  card_no: '',
  bank_address: '',
  walletType: '',
})
function addBindHandler() {
  showBottom.value = true
}

// 点击 tab事件
function onClickTab({ name }) {
  switch (name) {
    case 0:
      if (bankList.value && bankList.value.length > 0) {
        frm.value.bank_type = `${bankList.value[0].value}`
      }
      break
    case 1:
      if (coinList.value && coinList.value.length > 0) {
        frm.value.walletType = `${coinList.value[0].value}`
      }
      break
  }
}
// 修改 按钮事件
async function editCardHandler(d: ApiMemberBank) {
  console.log('id', d)
  editId.value = d.id
  if (d.bank_type.startsWith('USDT')) {
    active.value = 1
    frm.value.walletType = d.bank_address
    frm.value.card_no = d.card_no
  } else {
    active.value = 0
    frm.value.bank_address = d.bank_address
    frm.value.bank_type = d.bank_type
    frm.value.card_no = d.card_no
  }
  showBottom.value = true
}

// 添加银行卡收款信息
async function submitBankHandler() {
  if (frm.value.bank_type.trim().length <= 0) {
    showToast('请选择银行')
    return false
  }
  if (frm.value.owner_name.trim().length <= 0) {
    showToast('请填写开户人姓名')
    return false
  }
  if (frm.value.card_no.trim().length <= 0) {
    showToast('请填写银行账号')
    return false
  }

  if (editId.value > 0) {
    await editMemberCard(editId.value, frm.value)
  } else {
    await addMemberCard(frm.value)
  }
}

// 添加USDT收款信息
async function submitCoinHandler() {
  if (frm.value.walletType.trim().length <= 0) {
    showToast('请选择钱包类别')
    return false
  }
  if (frm.value.card_no.trim().length <= 0) {
    showToast('请填写钱包地址')
    return false
  }

  if (editId.value > 0) {
    await editMemberCard(editId.value, {
      bank_address: frm.value.walletType,
      bank_type: coinType.value,
      card_no: frm.value.card_no,
      owner_name: frm.value.owner_name,
    })
  } else {
    await addMemberCard({
      bank_address: frm.value.walletType,
      bank_type: coinType.value,
      card_no: frm.value.card_no,
      owner_name: frm.value.owner_name,
    })
  }

  return true
}

// 调用添加银行卡api
async function addMemberCard(d: object) {
  store.loading()
  try {
    const resp = await api.addMemberBank(d)
    console.log('submit bank info resp:', resp)
    if (resp && resp.code === 200) {
      showBottom.value = false
      frm.value.bank_address = ''
      frm.value.card_no = ''
      await userBankList()
      store.stopLoad()
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    store.stopLoad()
    console.log('submit bank err', err)
    const msg = (err as Error).message
    if (msg && msg.length > 0) {
      showToast(msg)
    }
  }
}

// 调用编辑收款信息
async function editMemberCard(id: number, d: object) {
  store.loading()
  try {
    const resp = await api2.editMemberBank(id, d)
    console.log('edit bank info resp:', resp)
    if (resp && resp.code === 200) {
      showBottom.value = false
      frm.value.bank_address = ''
      frm.value.card_no = ''
      await userBankList()
      store.stopLoad()
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    store.stopLoad()
    console.log('edit bank err', err)
    const msg = (err as Error).message
    if (msg && msg.length > 0) {
      showToast(msg)
    }
  }
}

// 获取银行信息和币种信息
async function getCoinList() {
  try {
    const resp = await api.bankType()
    console.log('usdt list resp:', resp)
    if (resp && resp.code === 200) {
      if (resp.data) {
        const tmp: DropdownItemOption[] = []
        Object.keys(resp.data).forEach((it: string) => {
          if (it.startsWith('USDT')) {
            coinType.value = it
            tmp.push({ text: resp.data[it], value: it, disabled: true })
          } else {
            tmp.push({ text: resp.data[it], value: it })
          }
        })
        bankList.value = tmp
        frm.value.bank_type = `${tmp[0].value}`
      }
      if (resp?.usdt) {
        const tmp: DropdownItemOption[] = []
        Object.keys(resp.usdt).forEach((it: string) => {
          tmp.push({ text: resp.usdt[it], value: it })
        })
        coinList.value = tmp
      }
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    console.log('usdt list err', err)
    const msg = (err as Error).message
    if (msg && msg.length > 0) {
      showToast(msg)
    }
  }
}

// 获取用户收款信息
async function userBankList() {
  try {
    const resp = await api.memberBank()
    console.log('bank list resp:', resp)
    if (resp && resp.code === 200) {
      if (resp?.bank_type) {
        const tmp: DropdownItemOption[] = []
        Object.keys(resp.bank_type).forEach((it: string) => {
          if (it.startsWith('USDT')) {
            tmp.push({ text: resp.bank_type[it], value: it, disabled: true })
          } else {
            tmp.push({ text: resp.bank_type[it], value: it })
          }
        })
        bankList.value = tmp
        frm.value.bank_type = `${tmp[0].value}`
      }
      list.value = resp?.data ?? null
    } else {
      throw new Error(resp.message)
    }
  } catch (err) {
    console.log('bank list err', err)
    const msg = (err as Error).message
    if (msg && msg.length > 0) {
      showToast(msg)
    }
  }
}

async function init() {
  store.loading()
  await getCoinList()
  await userBankList()
  store.stopLoad()
}

function onClickLeft() {
  router.back()
}

onMounted(() => {
  init()
  console.log('---------', store.getUser()?.realname ?? '')
})
</script>

<style lang="less" scoped>
.m-card {
  display: flex;
  flex-direction: column;
  height: 100%;

  .m-card-contain {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 16px;

    .m-bank-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      color: #fff;

      .m-bank-item {
        height: 135px;
        background: url('../../../assets/mobile/bank_bg.png') no-repeat;
        background-size: 100% 100%;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .m-bank-info {
          padding-left: 60px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 50px;
          align-items: center;

          .m-bank-name {
            font-size: 18px;
          }
          .m-btn-edit {
            border: 1px solid #fff;
            font-size: 12px;
            padding: 3px 5px;
            border-radius: 3px;
          }
        }
        .m-bank-card {
          margin-top: 5px;
          padding-left: 52px;
          font-size: 22px;
          font-weight: 600;
        }
      }
    }
    .m-btn-add {
      margin: 60px 0px 20px 0px;
    }
  }
  .m-card-pop {
    .m-tab-contain {
      padding: 10px 0px;
      background-color: var(--color-m-background);
      min-height: 356px;

      .m-btns {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        background-color: var(--color-m-background);
        padding: 10px;

        .m-btn {
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    }
    .m-center {
      padding-top: 40px;
      text-align: center;
    }
  }
}
</style>
<style lang="less">
@import url('@/views/mobile/common.less');
.m-card-pop {
  .van-tabs__nav {
    padding-bottom: 0px;
  }
  .van-tabs__line {
    bottom: 3px;
  }
  .van-dropdown-menu__bar {
    padding-right: 10px;
    height: 20px;
  }
}
</style>
