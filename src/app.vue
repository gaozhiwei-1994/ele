<template>
  <div>
    <ele-header :seller="seller"></ele-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from './components/header/header.vue'
  import axios from 'axios'
  const OK = 0
export default {
    data () {
      return {
        //seller: null  有问题
        seller: {}
      }
    },
    created () {
      // 使用vue-resource发送ajax请求express提供的接口
      /*this.$http.get('/api/seller')
        .then(response=>{
          const result = response.body
          //console.log(result)
          if(result.code === OK){
            this.seller = result.data
            console.log('vue-resource',this.seller)
          }
        })*/
      // 使用axios发送ajax请求mockjs提供的接口
      axios.get('/api2/seller')
        .then(response=>{
          const result = response.data
          //console.log(result)
          if(result.code === OK){
            this.seller = result.data
            console.log('axios',this.seller)
          }
        })
        .catch(error=>{
          console.log('error')
        })
    },
    components: {
      'ele-header': header
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixins.styl"
  .tab
    display flex
    height 40px
    line-height 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      text-align center
      font-size 14px
      color rgb(77,85,93)
      .active
        color: red
</style>
