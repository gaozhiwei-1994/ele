
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
