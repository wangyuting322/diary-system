// pages/circle/list.js
let moment = require('../../libs/moment.min')
let db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    list: [],
    isRefresh: false,
    haveMoreData: true,
    current: 1,
    size: 10,
    searchContent: '', // 搜索的内容
    timer: null, // 延时器
    // 竖向滚动条位置
    scrollTop: 0,
    // 滑动的按钮
    slideButtons: [{
      text: '编辑',
      src: '/static/images/edit (1).png', // icon的路径
    }, {
      text: '收藏',
      src: '/static/images/collection.png', // icon的路径
    }, {
      text: '取消收藏',
      src: '/static/images/collection-fill.png', // icon的路径
    }, {
      type: 'warn',
      text: '删除',
      src: '/static/images/delete (1).png', // icon的路径
    }],
  },
  /**
   * 滑动的按钮点击
   */
  slideButtonTap(e) {
    console.log('slide button tap', e)
    let type = e.detail.index
    let item = e.currentTarget.dataset.item
    switch (type) {
      case 0:
        // 编辑
        wx.redirectTo({
          url: '/pages/edit/edit?_id='+item._id,
        })
        break;
      case 1:
        // 修改收藏与否
        this.clickLove(item)
        break;
      case 2:
        // 删除
        this.delete(item)
        break;
      default:
        break;
    }
  },
  /**
   * 下拉刷新结束
   */
  stopRefresh() {
    wx.showToast({
      title: "刷新完成",
    })
  },
  /*
   * 返回顶部
   */
  totop() {
    console.log(5);
    this.setData({
      scrollTop: 0,
    })
  },
  /**
   * 防抖函数
   */
  debounce(func, time = 500) {
    if (this.data.timer) {
      clearTimeout(this.data.timer)
      this.setData({
        timer: null,
      })
    }
    this.setData({
      timer: setTimeout(() => {
        func()
      }, time),
    })
  },
  /**
   * 搜索
   */
  search(e) {
    this.debounce(() => {
      this.setData({
        searchContent: e.detail.value
      })
      this.getList()
    }, 500)
  },
  /**
   * 清空搜索
   */
  clear() {
    this.setData({
      searchContent: ""
    })
    this.getList()
  },
  getInfo(e) {
    // 去详情页
    let item = e.currentTarget.dataset.item
    wx.redirectTo({
      url: `/pages/info/info?_id=${item._id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'userInfo',
    }).then(res => {
      this.setData({
        userInfo: JSON.parse(res.data)
      })
    })
    wx.showLoading({
      title: '数据加载中',
    })
    this.getList()
  },
  /**
   * 刷新
   */
  refresh() {
    this.setData({
      isRefresh: true,
      current: 0
    })
    this.getList();
  },
  /**
   * 获取数据
   */
  getList() {
    wx.showLoading({
      title: '数据加载中',
    })
    let {
      current,
      size
    } = this.data
    // 获取日记本
    db.collection('circle')
      .where({
        isLove:true,
        title: db.RegExp({
          regexp: this.data.searchContent,
          options: 'i'
        })
      })
      .orderBy('time', 'desc')
      .limit(current * size)
      .get()
      .then(res => {
        console.log('getList:', res)
        let list = res.data.map(item => {
          item.time = moment(item.time).add(8, 'h').format('YYYY-MM-DD hh:mm:ss');
          item.slideButtons = [...this.data.slideButtons]
          if (item.isLove) {
            item.slideButtons.splice(1, 1)
          } else {
            item.slideButtons.splice(2, 1)
          }
          return item
        })
        if (list.length === this.data.list.length || list.length < current * size) {
          this.setData({
            haveMoreData: false
          })
        }
        this.setData({
          list,
        })
      })
      .catch(error => {
        console.log('getList error:', error)
        wx.showToast({
          title: '获取数据失败'
        })
      }).finally(() => {
        this.setData({
          isRefresh: false,
        })
        wx.hideLoading()
      })
  },
  /**
   * 下拉加载更多
   */
  getMore() {
    if (this.data.haveMoreData) {
      this.setData({
        current: this.data.current
      })
      this.getList()
    }
  },
  /**
   * 收藏
   */
  clickLove(item) {
    db.collection('circle')
      .doc(item._id)
      .update({
        data: {
          'isLove': !item.isLove
        }
      }).then(res => {
        console.log(res);
        this.getList()
      }).catch(err => {
        console.log(err);
        wx.showToast({
          title: '操作失败！！'
        })
      })
  },
  delete(item) {
    db.collection('circle')
      .doc(item._id)
      .remove()
      .then(res => {
        console.log(res);
        this.getList()
      }).catch(err => {
        wx.showToast({
          title: '操作失败！！'
        })
      })
  }
})