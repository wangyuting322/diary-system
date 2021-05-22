// pages/home/home.js
var that
var db = wx.cloud.database()
var amapFile = require('../../libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js
var config = require('../../libs/config.js');//如：..­/..­/libs/amap-wx.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc:'../../images/yinyue.png',
    title: '日记本',
    userInfo: null,
    list: [
      
      {
      "text": "日记本",
      "iconPath": "../../../images/weixin.png",
      "selectedIconPath": "../../../images/weixin_active.png",
    },
    // {
    //   "text": "收藏录",
    //   "iconPath": "../../images/tongxunlu.png",
    //   "selectedIconPath": "../../images/tongxunlu_active.png",
    // },
    // {
    //   "text": "发现",
    //   "iconPath": "../../images//faxian.png",
    //   "selectedIconPath": "../../images/faxian_active.png",
    // },
    {
      "text": "我的",
      "iconPath": "../../../images/phone.png",
      "selectedIconPath": "../../../images/phone.png",
    }
  ]
  
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 that = this;
 wx.getStorage({
  key: 'userInfo',
  success(res){
    that.setData({
      userInfo:JSON.parse(res.data)
    })
  }
 })
 var myAmapFun = new amapFile.AMapWX({key:config.Config.key});
    myAmapFun.getWeather({
      success: function(data){
        //成功回调
        console.log(data);
      },
      fail: function(info){
        //失败回调
        console.log(info)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  clickCircle(){
    wx.navigateTo({
      url: '../circle/circle',
    })
  },
  clickLove(){
    wx.navigateTo({
      url: '../love/love',
    })
  },
})