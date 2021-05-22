// pages/publish/publish.js
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    imageList: [],
    maxCount: 9,
    formData: {
      content: "",
      title: "",
    },
    rules: [{
      name: 'title',
      rules: [{
        required: true,
        message: '日记标题必填'
      }]
    }, {
      name: 'content',
      rules: [{
        required: true,
        message: '日记内容必填'
      }]
    }],
    error: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'userInfo',
      success: ({
        data
      }) => {
        this.setData({
          userInfo: JSON.parse(data)
        })
      }
    })
  },
  /**
   * 输入框修改
   */
  changeInput(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  /**
   * 选择图片
   */
  chooseImage() {
    wx.chooseImage({
      count: this.data.maxCount - this.data.imageList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      // tempFilePath可以作为img标签的src属性显示图片
      this.setData({
        imageList: [...this.data.imageList, ...res.tempFilePaths]
      })
    })
  },
  /**
   * 图片预览
   */
  previewImage(e) {
    let index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.imageList[index], // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
    })
  },
  uploadImage(index) {
    return new Promise((resolve,reject)=>{
      wx.cloud.uploadFile({
        cloudPath: 'circle_' + new Date().getTime() + ".jpg",
        filePath: this.data.imageList[index], // 文件路径
      }).then(res=>{
        resolve(res.fileID)
      }).catch(err=>{
        reject(err)
      })
    })
  },
  deleteImage(e) {
    let index = e.currentTarget.dataset.index
    let imageList = [...this.data.imageList]
    imageList.splice(index, 1)
    this.setData({
      imageList,
    })
  },
  submitForm() {
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        this.setData({
          error: errors[0].message
        })
        wx.hideLoading()
      } else {
// 是否所有图片上传成功
       Promise.all(this.data.imageList.map((item, index) => {
          return this.uploadImage(index)
        })).then(res => {
          console.log(res);
          this.addCircle({...this.data.formData,imageList:res})
        }).catch(err => {
          console.log(err);
        })
      }
    })
  },
  // 将发布的朋友圈信息，添加进云端数据库
  addCircle({content,title,imageList}) {
     // 显示加载中，含触摸蒙层
     wx.showLoading({
      title: '数据上传中',
      mask: true,
    })
    db.collection('circle').add({
      data: {
        content,
        title,
        imageList,
        time: new Date(),
        isLove: false,
        userInfo: this.data.userInfo,
      }
    }).then(res => {
      console.log('add circle success:', res)
      wx.hideLoading()
      // 返回上一页面
      wx.redirectTo({
        url: '/pages/circle/circle',
      })
    }).catch(error => {
      console.log('add circle error:', error)
      wx.hideLoading()
      wx.showToast({
        title: '发布失败'
      })
    })
  },

})