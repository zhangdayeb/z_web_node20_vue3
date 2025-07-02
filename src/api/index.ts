import { request } from '@/utils/http'
import type { AxiosResponse } from 'axios'

type Api = {
  [key: string]: (params?: object) => Promise<AxiosResponse>
}

type Api2 = {
  [key: string]: (id: number | string, params: object) => Promise<AxiosResponse>
}

const api: Api = {
  language: (params = {}) =>
    request.get('/language', { params, noNeedToken: true }), //多语言
  authCaptcha: (data = {}) =>
    request.post('/auth/captcha', data, { noNeedToken: true }), //图片验证码
  sysConfig: (params = {}) =>
    request.get('/system/configs', { params, noNeedToken: true }), //配置
  sysLinks: (params = {}) =>
    request.get('/system/link', { params, noNeedToken: true }), //链接
  banners: (params = {}) =>
    request.get('/banners', { params, noNeedToken: true }), //banner图
  games: (params = {}) => request.get('/games', { params, noNeedToken: true }), //游戏列表
  gameTypes: (data = {}) =>
    request.post('/game/type', data, { noNeedToken: true }), //游戏类别
  notices: (params = {}) =>
    request.get('/system/notices', { params, noNeedToken: true }), //通知

  login: (data = {}) =>
    request.post('/auth/login', data, { noNeedToken: true }), //登录
  gameApi: (params = {}) =>
    request.get('/games/apis', { params, noNeedToken: true }), //游戏分类
  gameList: (params = {}) =>
    request.get('/games/lists', { params, noNeedToken: true }), //游戏列表
  userRegister: (data = {}) =>
    request.post('/auth/register', data, {
      noNeedTip: true,
      noNeedToken: true,
    }), //用户注册
  me: (data = {}) => request.post('/auth/me', data), //用户信息
  updateMeInfo: (data = {}) => request.post('/auth/info/update', data), //更新用户信息
  activities: (params = {}) =>
    request.get('/activities', { params, noNeedToken: true }), //活动列表

  logout: (data = {}) => request.post('/auth/logout', data), //登出

  memberBank: (params = {}) => request.get('/member/bank', { params }), //用户银行列表
  addMemberBank: (data = {}) => request.post('/member/bank', data), //增加提款银行信息

  bankType: (params = {}) => request.get('/member/bank/type', { params }), //银行类别及虚拟币
  paymentOnline: (params = {}) =>
    request.get('/payment/online/list', { params }), //获取在线充值列表

  paymentNormal: (params = {}) =>
    request.get('/payment/normal/list', { params }), //获取普通支付列表

  favorList: (params = {}) => request.get('/favor/list', { params }), //我的收藏
  //data: {"game_type":3,"api_name":"AG","model_id":3586}
  favorAdd: (data = {}) => request.post('/favor/add', data), //收藏
  //data:{"game_type":3,"api_name":"AG","model_id":3584}
  favorDelete: (data = {}) => request.post('/favor/delete', data), //取消收藏
  // data: {"payment_id":1,"payment_type":"online_alipay","money":"200"}
  rechargeOnline: (data = {}) => request.post('/recharge/online', data), //在线充值
  // data: {"name":"12313","money":"100","account":"12313131","hk_at":"2024-10-31 21:53:19","payment_account":"622100120023112","payment_name":"张三","payment_id":2,"payment_type":"company_bankpay","payment_pic":"","payment_bank_type":"ABC"}
  rechargeNormal: (data = {}) => request.post('/recharge/normal', data), //普通充值

  uploadFile: (data = {}) =>
    request.post('/recharge/picture/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }), //文件上传

  modifyLoginPwd: (data = {}) => request.post('/member/password/modify', data), //修改登录密码
  //data: {qk_pwd: "123123"}
  setDrawingPwd: (data = {}) => request.post('/member/drawing_pwd/set', data), //设置取款密码
  //data: {"old_qk_pwd":"123123","qk_pwd":"112233","qk_pwd_confirmation":"112233"}
  modifyDrawingPwd: (data = {}) =>
    request.post('/member/drawing_pwd/set', data), //修改取款密码

  //data: {"name":"wang gang wang","money":0,"account":"123123123123","member_bank_id":1,"member_bank_text":"中国工商银行","member_remark":"","qk_pwd":"12312233"}
  drawing: (data = {}) => request.post('/drawing', data), //提款
  vips: (params = {}) => request.get('/member/vips', { params }), //vip等级信息
  moneyLogType: (params = {}) => request.get('/moneylog/type', { params }), //资金日志类别
  //data: {"created_at":["2024-11-02 00:00:00","2024-11-02 23:59:59"],"operate_type":"","money_type":"","page":1}
  moneyLog: (data = {}) => request.post('/moneylog', data), //资金日志
  gameLog: (data = {}) => request.post('/game/record', data), //游戏记录

  moneies: (data = {}) => request.post('/game/api_moneys', data), //获取各个游戏余额
  //{api_code: "AG"}
  money: (data = {}) => request.post('game/api_money', data), //
  //lang=zh_cn&gameCode=0&api_code=AG&isMobile=1
  gameLogin: (params = {}) => request.get('/game/login', { params }), //登录游戏
  //status: 0手动/1自动
  changeTrans: (data = {}) => request.post('/game/change_trans', data), //额度转换
  //api_code
  gameBalance: (data = {}) => request.post('/game/balance', data), //查询指定游戏余额
  recoveryLast: (data = {}) => request.post('/game/recovery_last', data), //获取所有游戏余额
  //data: {"money":"100","api_code":"EBET","money_type":"fs_money"}
  gameDeposit: (data = {}) => request.post('/game/deposit', data), //游戏转账-充值
  gameWithdraw: (data = {}) => request.post('/game/withdrawal', data), //游戏转账- 提款
  message: (data = {}) => request.post('/member/message/list', data), //我的消息

  aboutList: (params = {}) => request.get('/about/list', { params }), //关于列表
}

export const api2: Api2 = {
  editMemberBank: (id: number | string, params = {}) =>
    request.patch(`/member/bank/${id}`, params), //编辑提款银行信息
  activity: (id: number | string, params = {}) =>
    request.get(`/activity/${id}`, { params, noNeedToken: true }), //活动详情
}

export default api
