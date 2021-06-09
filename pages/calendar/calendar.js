import todo from '../../component/v2/plugins/todo'
import selectable from '../../component/v2/plugins/selectable'
import solarLunar from '../../component/v2/plugins/solarLunar/index'
import timeRange from '../../component/v2/plugins/time-range'
import week from '../../component/v2/plugins/week'
import holidays from '../../component/v2/plugins/holidays/index'
import plugin from '../../component/v2/plugins/index'

plugin
  .use(todo)
  .use(solarLunar)
  .use(selectable)
  .use(week)
  .use(timeRange)
  .use(holidays)

let db = wx.cloud.database()
let _ = db.command
let moment = require('../../libs/moment.min')
Page({
  data: {
    calendarConfig: {
      theme: 'elegant'
      // showHolidays: true,
      // emphasisWeek: true,
      // chooseAreaMode: true
      // defaultDate: '2020-9-8',
      // autoChoosedWhenJump: true
    },
    calendar: null,
    info: null,
  },
  afterTapDate(e) {
    let time = e.detail
    let min = new Date(`${time.year}/${time.month}/${time.date} 00:00:00`)
    let max = new Date(`${time.year}/${time.month}/${time.date} 23:59:59`)
    console.log(min, max);
    // 根据时间查询日记
    this.getCurrentDiary(min, max, false)
    console.log('afterTapDate', e.detail)
  },
  onReady() {
    const calendar = this.selectComponent('#calendar').calendar
    this.setData({
      calendar,
    })
    let currentDay = new Date()
    // 选中今天
    const toSet = [{
      year: Number(currentDay.getFullYear()),
      month: Number(currentDay.getMonth() + 1),
      date: Number(currentDay.getDate()),
    }]
    calendar.setSelectedDates(toSet)
    // 获取当前面板日期
    this.getCalendarDates()
  },
   /**
   * 切换时间（年月）时获取当前时间段内的日记
   */
  onSwipe(e) {
    this.getCalendarDates()
  },
  /**
   * 获取当前月份的日期
   */
  getCalendarDates() {
    // 获取当前月份的日期
    let res = this.data.calendar.getCalendarDates({
      lunar: true
    })
    // 获取当前月份的最大最小日期
    let mind = res[0]
    let min = new Date(`${mind.year}-${mind.month}-${mind.date} 00:00:00`)
    let maxd = res[res.length - 1]
    let max = new Date(`${maxd.year}-${maxd.month}-${maxd.date} 23:59:59`)

    // 根据时间查询日记
    this.getCurrentDiary(min, max)
  },
  /**
   * 获取时间区域内的数据
   * @param setTodoOrInfo true表示修改todo，false表示字修改info
   */
  getCurrentDiary(min, max, setTodoOrInfo = true) {
    db.collection('circle')
      .where(_.and([{
        time: _.gte(min),
      }, {
        time: _.lte(max)
      }])).get()
      .then(res => {
        if (setTodoOrInfo) {
          let dates = res.data.map(item => {
            let time = new Date(item.time)
            return {
              year: time.getFullYear(),
              month: time.getMonth() + 1,
              date: time.getDate(),
              todoText: item.title
            }
          })
          // 设置todo显示
          this.setTodos(dates)
        } else {
          let info = res.data.map(item => {
            let time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
            return {
              ...item,
              time,
            }
          })
          console.log(info);
          this.setData({
            info: info.length ? info : null,
          })
        }
      }).catch(res => {
        console.log(res);
        wx.showToast({
          title: '获取数据失败！！',
        })
      })
  },
  setTodos(dates) {
    this.data.calendar.setTodos({
      showLabelAlways: true,
      dates
    })
  },
})
