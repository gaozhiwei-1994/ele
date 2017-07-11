
import Vue from 'vue'
import VueRouter from 'vue-router'
import ratings from '../components/ratings/ratings.vue'
import goods from '../components/goods/goods.vue'
import seller from '../components/seller/seller.vue'
//声明使用 路由
Vue.use(VueRouter)

export default new VueRouter(
  {
    linkActiveClass: 'active', //配置 class
    routes: [
      {
        path: '/',//component: goods
        redirect: '/goods'
      },
      {
        path: '/goods',
        component: goods
      },
      {
        path: '/ratings',
        component: ratings
      },
      {
        path: '/seller',
        component: seller
      }
    ]
  }
)
