import dayjs from 'dayjs'
import api, { api2 } from '@/api'
import { useAppStore } from '@/stores/app'
import { showToast } from 'vant'
import type { AxiosResponse } from 'axios'

const domain = location.origin //'localhost:5173'

export function isMobile_old() {
  const userAgent = navigator.userAgent
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const rest = mobileRegex.test(userAgent)
  return rest
}

export function isMobile() {
  // 检查URL参数
  const urlParams = new URLSearchParams(window.location.search)
  const forceMobile = urlParams.get('mobile') === '1'
  const forcePC = urlParams.get('pc') === '1'

  if (forceMobile) {
    console.log('🔧 Force mobile via URL parameter')
    return true
  }

  if (forcePC) {
    console.log('🔧 Force PC via URL parameter')
    return false
  }

  // 设备检测
  const userAgent = navigator.userAgent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileDevice = mobileRegex.test(userAgent)

  // 屏幕尺寸检测（小于768px认为是移动设备）
  const isSmallScreen = window.innerWidth < 768

  console.log('🔍 Device detection:', {
    userAgent: userAgent.substring(0, 50) + '...',
    isMobileDevice,
    screenWidth: window.innerWidth,
    isSmallScreen,
    finalResult: isMobileDevice && isSmallScreen
  })

  // 只有真正的移动设备且屏幕小才返回 true
  // 这样 iPad 等大屏设备会显示PC版本
  return isMobileDevice && isSmallScreen
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
