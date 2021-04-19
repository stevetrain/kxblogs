import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
                   path: '/',
                   name: 'Cal',
                   props: true,
                   component: () => import('../Calendar.vue')
               },
                {
                   path: '/otherTab',
                   name: 'OtherTab',
                   component: () => import('../OtherTab.vue')
               }
               ];
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router