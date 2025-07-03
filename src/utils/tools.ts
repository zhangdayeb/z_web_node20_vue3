import dayjs from 'dayjs'
import api, { api2 } from '@/api'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import type { AxiosResponse } from 'axios'

const domain = location.origin //'localhost:5173'

export function isMobile() {
  const userAgent = navigator.userAgent
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const rest = mobileRegex.test(userAgent)
  console.log('rest', rest)
  return true
}
export function isMobile2() {
  const userAgent = navigator.userAgent
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const rest = mobileRegex.test(userAgent)
  // console.log('rest', rest)
  return rest
}

export function getImgUrl(url: string) {
  if (url.trim().length <= 0) {
    return ''
  }
  return  url
}

export function getImgUrl_old(url: string) {
  if (url.trim().length <= 0) {
    return ''
  }
  return `${domain}` + url
}

export function getDomain() {
  return domain
}

export function getCurrentTime() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

//调用api
export async function invokeApi(
  method: string,
  d: object = {},
  id: string | number = '',
  isLoad: boolean = true,
): Promise<AxiosResponse<object, object> | null> {
  const store = useAppStore()
  if (isLoad) {
    store.loading()
  }

  try {
    let resp: AxiosResponse<object, object> | null = null
    if (Object.keys(api).includes(method)) {
      resp = await api[method](d)
    } else if (Object.keys(api2).includes(method)) {
      resp = await api2[method](id, d)
    }
    console.log(`api ${method} resp:`, resp ?? null)
    if (resp && (resp?.code ?? 0) === 200) {
      if (isLoad) {
        store.stopLoad()
      }
      return resp
    } else {
      if (resp) {
        if (isLoad) {
          store.stopLoad()
        }
        const msg = resp?.message ?? ''
        if (msg.length > 0) {
          showToast(msg)
          return null
        }
        return resp
      }
    }
  } catch (err) {
    console.error('err:', err, 'method', method)
    if (isLoad) {
      store.stopLoad()
    }
  }
  return null
}

export function getDateRange(days: number) {
  const start = dayjs().endOf('day')
  const end = dayjs().subtract(days, 'day').startOf('day')
  return [
    start.format('YYYY-MM-DD HH:mm:ss'),
    end.format('YYYY-MM-DD HH:mm:ss'),
  ]
}

export function getYestodayRange() {
  const curr = dayjs().subtract(1, 'day')
  return [
    curr.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    curr.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]
}
