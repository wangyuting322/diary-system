// pages/publish/publish.js
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: '',
    isLove: false,
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
   * 获取详情
   * @param {*} _id 
   */
  getInfo(_id) {
    db.collection('circle')
      .doc(_id)
      .get()
      .then(res => {
        let info = res.data
        this.setData({
          formData: {
            content: info.content,
            title: info.title,
          },
          imageList: info.imageList,
          isLove: info.isLove
        })
      }).catch(err => {
        console.log(err);
        wx.showToast({
          title: '获取详情失败',
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _id: options._id
    })
    this.getInfo(options._id)
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
  deleteImage(e) {
    let index = e.currentTarget.dataset.index
    let imageList = [...this.data.imageList]
    imageList.splice(index, 1)
    this.setData({
      imageList,
    })
  },
  uploadImage(index) {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: 'circle_' + new Date().getTime() + ".jpg",
        filePath: this.data.imageList[index], // 文件路径
      }).then(res => {
        resolve(res.fileID)
      }).catch(err => {
        reject(err)
      })
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
          this.editCircle({
            ...this.data.formData,
            imageList: res
          })
        }).catch(err => {
          console.log(err);
        })
      }
    })
  },
  // 将发布的朋友圈信息，添加进云端数据库
  editCircle({
    content,
    title,
    imageList
  }) {
    // 显示加载中，含触摸蒙层
    wx.showLoading({
      title: '数据更新中',
      mask: true,
    })
    db.collection('circle').doc(this.data._id).update({
      data: {
        'content': content,
        "title": title,
        "imageList": imageList,
        'time': new Date(),
      }
    }).then(res => {
      console.log('edit circle success:', res)
      wx.hideLoading()
      // 返回上一页面
      wx.redirectTo({
        url: '/pages/circle/circle',
      })
    }).catch(error => {
      console.log('add circle error:', error)
      wx.hideLoading()
      wx.showToast({
        title: '更新失败'
      })
    })
  },

})