<template>
    <div class="header">
      <div class="content-wrapper">
        <div class="avatar">
          <img :src="seller.avatar" alt="">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟到达
          </div>
          <div class="support" v-if="seller.supports">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div class="supports_count" v-if="seller.supports" @click="showDetail(true)">
          <span class="count">{{seller.supports.length}}个</span>
          <span class="icon-keyboard_arrow_right"></span>
        </div>
      </div>
      <div class="bulletin-wrapper" @click="showDetail(true)">
        <span class="bulletin-title"></span>
        <span class="bulletin-text">{{seller.bulletin}}</span>
        <span class="icon-keyboard_arrow_right"></span>
      </div>
      <div class="background">
        <img :src="seller.avatar" alt="">
      </div>
      <transition name="fade">
        <div class="detail" v-show="detailShow">
          <div class="detail-wrapper">
            <div class="detail-main">
              <div class="name">{{seller.name}}</div>
              <div class="star-wrapper">
                <star :size="48" :score="seller.score"></star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul class="supports">
                <li class="support" v-for="support in seller.supports">
                  <span class="icon" :class="classMap[support.type]"></span>
                  <span class="text">{{support.description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="content">
                <p>{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="showDetail(false)">
            <span class="icon-close"></span>
          </div>
        </div>
      </transition>
    </div>
</template>

<script>
  import star from '../star/star.vue'
  export default {
    props: ['seller'],
    data () {
      return {
        detailShow: false
      }
    },
    created () {
      //定义一个数组保存 五种活动对应的前缀
      this.classMap = ["decrease", "discount", "guarantee", "invoice", "special"]
    },
    methods: {
      //控制遮罩显示
      showDetail (isShow) {
        this.detailShow = isShow
      }
    },
    components: {
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .header
    position relative
    background rgba(7,17,27,0.5)
    color white
    overflow hidden

    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      .avatar
        width 64px
        height 64px
        display inline-block
        vertical-align top
        img
          width 100%
      .content
        display inline-block
        margin-left 16px
        padding 2px 0 2px
        .title
          .brand
            display inline-block
            width 30px
            height 18px
            background-repeat no-repeat
            background-size 30px 18px
            vertical-align middle
            bg-image(brand)
          .name
            margin-left 6px
            font-size 16px
            line-height 18px
            font-weight bold
        .description
          font-size 12px
          line-height 12px
          font-weight 200
          margin 8px 0 10px
        .support
          .icon
            display inline-block
            width 12px
            height 12px
            background-size 12px 12px
            background-repeat no-repeat
            vertical-align middle
          .discount
            bg-image(discount_1)
          .decrease
            bg-image(decrease_1)
          .guarantee
            bg-image(guarantee_1)
          .invoice
            bg-image(invoice_1)
          .special
            bg-image(special_1)
          .text
            font-size 10px
            line-height 12px
            font-weight 200
            margin-left 4px
      .supports_count
        position absolute
        right 12px
        bottom 18px
        height 24px
        padding 4px 8px
        box-sizing border-box
        background rgba(0,0,0,0.2)
        border-radius 8px
        .count
          font-size 10px
          line-height 12px
          font-weight 200


    .bulletin-wrapper
      position relative
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      height 28px
      line-height 28px
      padding 0 12px
      background rgba(7,17,27,0.2)
      .bulletin-title
        display inline-block
        background-repeat no-repeat
        background-size 22px 12px
        height 12px
        width 22px
        vertical-align middle
        bg-image(bulletin)
      .bulletin-text
        margin 0 4px
        font-size 10px
        font-weight 200
      .icon-keyboard_arrow_right
        position absolute
        top 9px
        right 2px

    .background
      position absolute
      left 0
      right 0
      bottom 0
      top 0
      z-index -1
      filter blur(10px)
      img
        width 100%
        height 100%


    .detail
      position fixed
      right 0
      bottom 0
      top 0
      left 0
      z-index 100
      background rgba(7,17,27,0.8)
      &.fade-enter-active, &.fade-leave-active
        transition: opacity .3s linear
      &.fade-enter,&.fade-leave-to
        opacity: 0

      .detail-wrapper
        min-height 100%
        padding 64px 0 32px
        .detail-main
          .name
            font-size 16px
            font-weight 700
            line-height 16px
            text-align center
            margin-bottom 16px

          .star-wrapper
            height 24px
            text-align center

          .title
            padding 28px 36px 24px
            display flex
            .line
              position relative
              top 8px
              flex 1
              width 224px
              height 2px
              background rgba(255,255,255,0.2)
            .text
              float left
              margin 0 12px

          .supports
            padding 0 48px
            .support
              margin-bottom 12px
              .icon
                display inline-block
                width 16px
                height 16px
                background-repeat no-repeat
                background-size 16px 16px
                vertical-align middle
              .decrease
                bg-image(decrease_2)
              .discount
                bg-image(discount_2)
              .special
                bg-image(special_2)
              .invoice
                bg-image(invoice_2)
              .guarantee
                bg-image(guarantee_2)
              .text
                margin-left 6px
                font-size 12px
                line-height 12px
                font-weight 200

          .content
            padding 0 48px
            font-size 12px
            line-height 24px
            font-weight 200

      .detail-close
        margin-top -160px
        text-align center
        height 32px
        font-size 32px
        line-height 32px
        color rgba(255,255,255,0.5)

</style>
