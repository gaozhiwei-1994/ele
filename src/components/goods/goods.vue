<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!--current  当前的-->
          <li class="menu-item" v-for="(good,index) in goods"
           :class="{current: index===currentIndex}" @click="clickMenuItem(index,$event)">
          <span class="text border-1px">
            <span class="icon" v-if="good.type>=0" :class="classMap[good.type]"></span>
            {{good.name}}
        </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="(good,index) in goods">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item border-1px" v-for="food in good.foods" @click="clickFood(food,$event)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :food-list="foodList"
                :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice"
                :clear-cart="clearCart"
                :update-food-count="updateFoodCount"
                ref="shopcart"></shopcart>
    </div>
    <food :food="selectFood" :update-food-count="updateFoodCount" ref="food"></food>
  </div>
</template>

<script>
  import axios from 'axios'
  //引入better-scroll
  import Bscroll from 'better-scroll'
  import Vue from 'vue'
  import cartcontrol from '../cartControl/cartControl.vue'
  import shopcart from '../shopcart/shopcart.vue'
  import food from '../food/food.vue'
  const OK = 0
  export default {
    props: ['seller'],
    data () {
      return {
        goods: [],
        tops: [],
        scrollY: 0,
        selectFood: {}
      }
    },
    created () {
      //定义一个数组保存 五种活动对应的前缀
      this.classMap = ["decrease", "discount", "guarantee", "invoice", "special"]
      //接口获取数据
      axios.get('/api2/goods')
        .then(response=>{
          var result = response.data
          if(result.code === OK){
            //更新数据
            this.goods = result.data
            //console.log(this.goods)
            //在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
            Vue.nextTick(()=>{
              this._initScroll()
              this._initTops()
            })
          }
        })
    },
    methods: {
      //函数名前加_表明不是事件回调函数
      _initScroll () {
        //创建 分类 列表 scroll对象
        new Bscroll(this.$refs.menuWrapper,{
          click: true
        })
        //创建 food 列表 scroll 对象
        this.foodsScroll = new Bscroll(this.$refs.foodsWrapper,{
          //配置 派发click事件
          click: true,
          // 配置 滚动 事件
          probeType: 3
        })
        //绑定 scroll  监听
        this.foodsScroll.on('scroll',pos=>{
          //console.log(pos.y)
          //取绝对值
          this.scrollY = Math.abs(pos.y)
        })
      },
      _initTops () {
        var tops = this.tops
        var top = 0
        tops.push(top)
        //获取到所有的food的li
        var lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        ;[].slice.call(lis).forEach(li=>{
          //累加他们的高度，并且依次添加到数组
          top += li.clientHeight
          tops.push(top)
        })
        console.log(this.tops)
      },
      //点击左侧列表事件回调
      clickMenuItem (index,event) {
        //取消pc端默认的click事件
        if(!event._constructed){
          return
        }
        //console.log(event)
        //获取当前点击的li
        var li = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')[index]
        //右侧 滚动到对应当前点击的li的位置
        this.foodsScroll.scrollToElement(li,300)
      },
      // 点击 + - 更新 food 购选数量
      updateFoodCount (food,isAdd,event) {
        //event.stopPropagation()
        //阻止pc端 默认click

        if(!event._constructed){ // _constructed是better-scroll库添加的
          return
        }
        if(isAdd){ //增加

          if(!food.count){ //count为0 或者count不存在
            // 新增count属性
            // food.count = 1  // 没有监视-->没有数据绑定, 界面不会更新
            Vue.set(food,'count',1) // 添加count属性
          }else{
            food.count++
            //console.log('++')
          }
          this.$refs.shopcart.drop(event.target)
        }else{
          if(food.count){ //count存在 且 值不为0 --
            food.count--
          }
        }
      },
      //清空购物车
      clearCart (event) {
        this.foodList.forEach(food=>{
          //将购物车中所有food的数量 置为0
          food.count = 0
        })
      },
      //点击 某个food  进入food详情
      clickFood (food,event) {
        if(!event._constructed){
          return
        }
        //console.log(111)
        this.selectFood = food
        this.$refs.food.show(true)
      }
    },
    computed: {
      currentIndex () {
        const {tops,scrollY} = this
        //findIndex 返回表达式为true的元素的下标
        return tops.findIndex((top,index)=>{
          return scrollY >= top && scrollY < tops[index+1]
        })
      },
      //购物车商品列表
      foodList () { //返回所有count>0 的food数组
        const foods = []
        this.goods.forEach(good=>{
          good.foods.forEach(food=>{
            if(food.count){ //如果count存在且不为0，添加到数组
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    components: {
      cartcontrol,
      shopcart,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px

</style>
