//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 云开发环境id
        env: 'cloud1-2gq77sxw9b99b537',
        // traceUser: true,
      })
    }
    this.globalData = {}
  }
})