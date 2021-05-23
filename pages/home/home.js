// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: '../../images/yinyue.png',
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
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          userInfo: JSON.parse(res.data)
        })
      }
    })
  },
  clickCircle() {
    wx.navigateTo({
      url: '../circle/circle',
    })
  },
  clickLove() {
    wx.navigateTo({
      url: '../love/love',
    })
  },
  clickCalendar(){
    wx.navigateTo({
      url: '../calendar/calendar',
    })
  }
})