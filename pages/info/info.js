// pages/info/info.js
let moment = require('../../libs/moment.min')
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
  },
  /**
   * 获取详情
   * @param {*} _id 
   */
  getInfo(_id) {
    db.collection('circle')
      .doc(_id)
      .get()
      .then(res => {
        let info = res.data
        info.time = moment(info.time).format('YYYY-MM-DD HH:mm:ss')
        this.setData({
          info,
        })
      }).catch(err => {
        console.log(err);
        wx.showToast({
          title: '获取详情失败',
        })
      })
  },
    /**
   * 图片预览
   */
  previewImage(e) {
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.info.imageList[index], // 当前显示图片的http链接
      urls: this.data.info.imageList // 需要预览的图片http链接列表
    })
  },
  edit(e){
    let item = e.currentTarget.dataset.item

  // 编辑
  wx.redirectTo({
    url: '/pages/edit/edit?_id='+item._id,
  })
  },
  clickLove(e){
    db.collection('circle')
    .doc(this.data.info._id)
    .update({
      data: {
        'isLove': !this.data.info.isLove
      }
    }).then(res => {
      console.log(res);
      this.setData({
        info:{...this.data.info,isLove:!this.data.info.isLove}
      })
      // this.getInfo(this.data.info._id)
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '操作失败！！'
      })
    })
  },
  delete(e){
    db.collection('circle')
    .doc(this.data.info._id)
    .remove()
    .then(res => {
      console.log(res);
      wx.redirectTo({
        url: '/pages/circle/circle',
      })
    }).catch(err => {
      wx.showToast({
        title: '操作失败！！'
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.getInfo(options._id)
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

  }
})