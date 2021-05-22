// pages/login/login.js
let db = wx.cloud.database() //操作云端数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },

  onShow: function () {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.toHome()
      }
    })
  },
/**
 * 获取用户授权
 */
  getUserProfile() {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        let user = res.userInfo
        wx.setStorage({
          data: JSON.stringify(user),
          key: 'userInfo',
        })
        this.toHome()
      },
      fail: (err) => {
        wx.showToast({
          title: '授权失败',
        })
      }
    })
  },
  toHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  }
})