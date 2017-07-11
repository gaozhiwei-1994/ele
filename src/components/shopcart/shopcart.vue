<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toogleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight:totalCount>0}">
              <i class="icon-shopping_cart highlight"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="totalPrice>=minPrice?'enough':'not-enough'">
            {{payText}}
          </div>
        </div>
      </div>

      <div class="ball-container">
        <transition name="drop" v-for="(ball, index) in balls" :key="index"
                    @before-enter="beforeDrop"
                    @enter="dropping"
                    @after-enter="afterDrop"
                    v-bind:css="false">
          <div class="ball"  v-show="ball.isShow">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>

     <transition name="fold">
       <div class="shopcart-list" v-show="listShow">
         <div class="list-header">
           <h1 class="title">购物车</h1>
           <span class="empty" @click="clearCart">清空</span>
         </div>
         <div class="list-content" ref="listContent">
           <ul>
             <li class="food" v-for="food in foodList">
               <span class="name">{{food.name}}</span>
               <div class="price"><span>￥{{food.price}}</span></div>
               <div class="cartcontrol-wrapper">
                 <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
               </div>
             </li>
           </ul>
         </div>
       </div>
     </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toogleList"></div>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartControl/cartControl.vue'
  export default {
    props: {
      foodList: Array,
      deliveryPrice: Number,
      minPrice: Number,
      clearCart: Function,
      updateFoodCount: Function
    },
    data () {
      return {
        isShow: false,
        balls: [
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false}
        ],
        droppingBalls: []
      }
    },
    methods: {
      //切换购物车 显示 隐藏  效果
      toogleList () {
        this.isShow = !this.isShow
      },
      //让一个 隐藏的 小球 启动一个 显示 的 动画
      drop (startEl) {
        console.log(startEl)
        //找到 隐藏的  小球
        const ball = this.balls.find(ball =>!ball.isShow)
        if(ball){
          //显示小球
          ball.isShow = !ball.isShow
          //将传过来的 event.target 保存到 ball 上
          ball.startEl = startEl
          //添加到 数组   先点击的先显示 先添加进数组
          this.droppingBalls.push(ball)
        }
      },
      //动画 起点位置
      beforeDrop (el) {
        //找到 即将执行动画的对应的ball
        const ball = this.droppingBalls.shift()
        //初始化
        var offsetX = 0
        var offsetY = 0
        //计算
        //触发动画的+ 的位置
        const {left,top} = ball.startEl.getBoundingClientRect()
        // 小球 原本的 定位 位置
        const elLeft = 32
        const elBottom = 22
        //小球动画的 起始位置
        offsetX = left - elLeft
        offsetY = - (window.innerHeight - elBottom - top)
        //指定transform 样式
        el.style.transform = `translate3d(0,${offsetY}px,0)`
        el.children[0].style.transform = `translate3d(${offsetX}px,0,0)`
        // 保存ball到el，保证其他 方法也能 访问ball
        el.ball = ball
      },
      //动画结束位置
      dropping (el) {
        // 强制重排重绘
        var temp = el.clientHeight
        //结束 样式  必须是一个 异步操作
        this.$nextTick(() => {
          // 指定transform样式
          el.style.transform = 'translate3d(0, 0, 0)'
          el.children[0].style.transform = 'translate3d(0, 0, 0)'
        })
      },
      //隐藏 el
      afterDrop (el) {
        // 必须延迟更新状态
        setTimeout(() => {
          el.ball.isShow = false
        }, 400)
      },
      //点击 结算
      pay() {
        if(this.totalPrice>=this.minPrice) {
          alert(`支付${this.totalPrice+this.deliveryPrice}`)
        }
      }
    },
    computed: {
      //购物车 商品总数
      totalCount () {
        return this.foodList.reduce((preTotal,food)=>{
          return preTotal + food.count
        },0)
      },
      //总价格
      totalPrice () {
        return this.foodList.reduce((preTotal,food)=>{
          return preTotal + food.count * food.price
        },0)
      },
      //右侧 3种状态
      payText () {
        var {minPrice,totalPrice} = this
        if(totalPrice===0){
          return `￥${minPrice}元起送`
        }else if(totalPrice<minPrice){
          return `还差￥${minPrice - totalPrice}元起送`
        }else{
          return '去结算'
        }
      },
      //购物车列表 和 遮罩 显示
      listShow () {
        //如果 购物车为空， 直接返回false 且将isShow置为false
        if (this.totalCount === 0) {
          this.isShow = false
          return false
        }
        //如果是显示状态
        if(this.isShow){
          Vue.nextTick(()=>{
            if(!this.scroll){
              this.scroll = new BScroll(this.$refs.listContent,{
                click: true
              })
            }else{
              //刷新一个滚动(如果高度大于容器元素的高度, 形成滚动条)
              this.scroll.refresh()
            }
          })
        }

        return this.isShow
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
