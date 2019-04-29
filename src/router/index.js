import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
    routes : [
        {
            path: '/',
            name: 'overview',
            component: () => import('../components/overview.vue')
         },
        {
           path: '/insights',
           name: 'insights',
           component: () => import('../components/insights.vue')
        },
        {
            path: '/sleepDiary',
            name: 'sleepDiary',
            component: () => import('../components/sleepDiary.vue')
         }
     ]
}) 

export default router
