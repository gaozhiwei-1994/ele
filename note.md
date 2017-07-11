##------------------------vue 饿了么 app-------------------------------##

##   搭建项目
  	npm install -g vue-cli : 全局下载工具
  	vue init webpack eleApp :下载基于webpack模板项目
  	npm install : 下载项目依赖的所有模块
  
  引入 配置 路由
  
##   布局
  粘连布局
  1. 包裹起拉升
  2. main元素设置min-height
  3. footer元素-margin
  
##   mock 数据   创建接口
  设计数据(json)结构
    结构：不变,数据类型，数据名称（属性名等等）
    数据：可变，value
  1. express
    可以通过浏览器或者postman测试访问，（web请求和ajax请求都可以）
    快速搭建模拟后台，但是只能测试运行，不能打包运行
    只能提供静态数据，不能实现动态数据
    eg：
      /*mock data start*/
      // 创建express对象
      var app = express()
      //引入获取数据
      const apiData  = require('../src/mock/data.json')
      const goods = apiData.goods
      //创建路由器
      var apiRouter = express.Router()
      //注册路由
      apiRouter.get('/goods',function (req,res) {
        res.json({
          code: 0, //标识数据返回是否成功
          data: goods
        })
      })
      //使用路由
      app.use('/api',apiRouter)
      /*mock data end*/
  2. mockjs
    在main.js文件中需要引入加载模块
    mockjs可以提供动态随机（值）数据，可以测试运行也可以打包运行
    无法通过浏览器或者postman访问，只能编码访问
    eg：
      //使用mockjs来mock数据, 提供mock数据API接口      
      //引入Mock  和  数据
      import Mock from 'mockjs'
      import data from './data.json'
      
      //注册接口
      Mock.mock('/api2/goods',{
        code: 0, //返回数据标识
        data: data.goods
      })
      Mock.mock('/api2/ratings',{
        code: 0, //返回数据标识
        data: data.ratings
      })
      Mock.mock('/api2/seller',{
        code: 0, //返回数据标识
        data: data.seller
      })      
      //不需要export 暴露
      
##   发送ajax请求 接口
  1. vue-resource
    依赖于vue,但不是官方提供的，vue2.0以后不建议使用
    在main 主入口文件引入，并且声明使用
    this.$http.get()
  2. axios
    独立的，专门用于发送ajax请求的库
    在需要使用的组件中引入
     axios.get()
     
  以上两个封装的是XMLHttpRequest，使用promise风格
  3. fetch.js
    也是用来发送ajax请求
    不是封装的XMLHttpRequest
    兼容更低版本浏览器
     
##   better-scroll
  npm install better-scroll --save
  在需要使用的组件中引入
  import Bscroll from 'better-scroll'
  let scroll = new BScroll(el, {
    //配置选项
  })
  startX: 0 开始的X轴位置
  startY: 0 开始的Y轴位置
  scrollY: true 滚动方向为 Y 轴
  scrollX: 'true' 滚动方向为 X 轴
  click: true 是否派发click事件
  probeType: 1 会截流,只有在滚动结束的时候派发一个 scroll 事件。
      2在手指 move 的时候也会实时派发 scroll 事件，不会截流。 
      3除了手指 move 的时候派发scroll事件，在 swipe（手指迅速滑动一小段距离）的情况下，
      列表会有一个长距离的滚动动画，这个滚动的动画过程中也会实时派发滚动事件
  
  Events 事件
  //绑定监听
  scroll.on('scroll', (pos) => {
    console.log(pos.x + '~' + pos.y)
    ...
  })
  
  scrollToElement(el, time, offsetX, offsetY, easing)
  滚动到某个元素，el（必填）表示 dom 元素，time 表示动画时间，offsetX 和 offsetY 表示坐标偏移量，
  easing 表示缓动函数
  
  better-scroll,pc端存在问题，会触发两次事件，pc端有默认事件
  通过better-scroll派发的click事件event中有constructed属性  
  if (!event._constructed) {
    return  //终止pc端默认的click事件
  }
  
##   新知识点
  1. findIdex返回表达式为true的元素的下标
  eg:
    tops.findIndex((top,index)=>{
              return scrollY >= top && scrollY < tops[index+1]
            })
            
   map/reduce/filter/find
            
  2. Vue.set( object, key, value )    
    参数：    
    {Object} object
    {string} key
    {any} value
    返回值： 设置的值.
    用法：
    设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。
    这个方法主要用于避开 Vue 不能检测属性被添加的限制。
    注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象
    
  3. Vue.nextTick(()=>{})
    //在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
  4. 动画生命周期
  5. created 和 updated
  6. 
