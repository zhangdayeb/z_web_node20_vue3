import { createRouter, createWebHistory } from 'vue-router'
import { isMobile as mobileFunc } from '@/utils/tools'

const dynaDir = () => (mobileFunc() ? 'mobile' : 'pc')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(`@/views/${dynaDir()}/home/index.vue`),
      redirect: 'main',
      children: [
        {
          name: 'main',
          path: '/main',
          component: () => import(`@/views/${dynaDir()}/home/main.vue`),
        },
        {
          name: 'gift',
          path: '/gift',
          component: () => import(`@/views/${dynaDir()}/gift/index.vue`),
        },
        {
          name: 'support',
          path: '/support',
          component: () => import(`@/views/${dynaDir()}/support/index.vue`),
        },
        {
          name: 'mine',
          path: '/mine',
          component: () => import(`@/views/${dynaDir()}/mine/index.vue`),
        },
      ],
    },
    {
      path: '/game/:name/:type',
      name: 'game',
      component: () => import(`@/views/${dynaDir()}/home/game.vue`),
    },
    {
      path: '/register/:invite_code?',
      name: 'register',
      component: () => import(`@/views/${dynaDir()}/mine/register.vue`),
    },
    {
      name: 'activity',
      path: '/activity/:id',
      component: () => import(`@/views/${dynaDir()}/gift/activity.vue`),
    },
    {
      name: 'safeSettings',
      path: '/safeSettings',
      component: () => import(`@/views/${dynaDir()}/mine/safeSetting.vue`),
    },
    {
      name: 'deposit',
      path: '/deposit',
      component: () => import(`@/views/${dynaDir()}/mine/deposit.vue`),
    },
    {
      name: 'withdraw',
      path: '/withdraw',
      component: () => import(`@/views/${dynaDir()}/mine/withdraw.vue`),
    },
    {
      name: 'vip',
      path: '/vip',
      component: () => import(`@/views/${dynaDir()}/mine/vip.vue`),
    },
    {
      name: 'card',
      path: '/card',
      component: () => import(`@/views/${dynaDir()}/mine/card.vue`),
    },
    {
      name: 'modifyPwd',
      path: '/modifyPwd',
      component: () => import(`@/views/${dynaDir()}/mine/modify_pwd.vue`),
    },
    {
      name: 'withdrawalPwd',
      path: '/withdrawalPwd',
      component: () =>
        import(`@/views/${dynaDir()}/mine/modify_withdrawal_pwd.vue`),
    },
    {
      name: 'vipDetail',
      path: '/vipDetail',
      component: () => import(`@/views/${dynaDir()}/mine/vip_detail.vue`),
    },
    {
      name: 'moneyLog',
      path: '/moneyLog',
      component: () => import(`@/views/${dynaDir()}/mine/money_log.vue`),
    },
    {
      name: 'gameRecord',
      path: '/gameRecord',
      component: () => import(`@/views/${dynaDir()}/mine/game_log.vue`),
    },
    {
      name: 'extension',
      path: '/extension',
      component: () => import(`@/views/${dynaDir()}/mine/extension.vue`),
    },
    {
      name: 'personal',
      path: '/personal',
      component: () => import(`@/views/${dynaDir()}/mine/personal.vue`),
    },
    {
      name: 'transfer',
      path: '/transfer',
      component: () => import(`@/views/${dynaDir()}/mine/transfer.vue`),
    },
    {
      name: 'collection',
      path: '/collection',
      component: () => import(`@/views/${dynaDir()}/mine/collection.vue`),
    },
    {
      name: 'notices',
      path: '/notices',
      component: () => import(`@/views/${dynaDir()}/mine/notices.vue`),
    },
    {
      name: 'to_game',
      path: '/to_game/:game/:code/:mobile',
      component: () => import(`@/views/${dynaDir()}/home/to_game.vue`),
    },
  ],
})

export default router
