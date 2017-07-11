<template>
  <div class="star" :class="`star-${size}`">
    <span class="star-item" :class="c" v-for="c in starClasses"></span>
  </div>
</template>

<script>
  /*
   最高分: 5
   小数部分>=0.5
   */
  const ON = 'on'
  const HALF = 'half'
  const OFF = 'off'
  export default {
    props: {
      size: Number,
      score: Number
    },
    computed: {
      //计算星星的显示状态
      starClasses () {
        //初始化一个空数组
        const scs = []

        //向scs添加 ON
        var score = this.score
        var scoreInt = Math.floor(score)
        for (let i=0; i<scoreInt; i++) {
          scs.push(ON)
        }

        //向scs添加 HALF
        if(score-scoreInt>=0.5){
          scs.push(HALF)
        }

        //向scs添加 OFF
        if(scs.length<5){
          scs.push(OFF)
        }
        return scs
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .star-24
    .star-item
      display inline-block
      width 10px
      height 10px
      margin 0 4px
      background-size 10px 10px
      background-repeat no-repeat
    .on
      bg-star(star24_on)
    .half
      bg-star(star24_half)
    .off
      bg-star(star24_off)
  .star-36
    .star-item
      display inline-block
      width 15px
      height 15px
      margin 0 4px
      background-size 15px 15px
      background-repeat no-repeat
    .on
      bg-star(star36_on)
    .half
      bg-star(star36_half)
    .off
      bg-star(star36_off)
  .star-48
    .star-item
      display inline-block
      width 20px
      height 20px
      margin 0 4px
      background-size 20px 20px
      background-repeat no-repeat
    .on
      bg-star(star48_on)
    .half
      bg-star(star48_half)
    .off
      bg-star(star48_off)
</style>
