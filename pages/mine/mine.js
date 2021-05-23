// miniprogram/pages/mine/mine.js
let db = wx.cloud.database()
let moment = require('../../libs/moment.min')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    days: 0,
    sum: 0,
    wordsNum: 0,
  },
  /**
   * 获取统计数据
   */
  getStatic() {
    wx.showLoading({
      title: '数据加载中',
    })
    db.collection('circle')
      .get()
      .then(res => {
        console.log(res);
        let sum = res.data.length
        let wordsNum = res.data.reduce((pre, next) => {
          return pre + next.content.length
        }, 0);
      let days = res.data.reduce((pre, next) => {
          console.log(pre);
          let re = pre.find(item => {
            let day = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
            let day2 = moment(next.time).format('YYYY-MM-DD HH:mm:ss')
            return day === day2
          })
          if (re) return pre;
          return [...pre, next]
        }, []).length

        this.setData({
          days,
          sum,
          wordsNum,
        })
      })
      .catch(err => {
        console.log(err);
        wx.showToast({
          title: '获取数据失败',
        })
      }).finally(()=>{
        wx.hideLoading()
      })
  },
  /**
   * 查看天气
   */
  clickWeather() {
    wx.navigateTo({
      url: '../weather/weather',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户详情
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        let userInfo = JSON.parse(res.data)
        userInfo.gender = userInfo.gender == 1 ? '男' : (userInfo.gender == 2 ? '女' : "未知")
        this.setData({
          userInfo: userInfo
        })
      }
    })
    this.getStatic()
  },

})