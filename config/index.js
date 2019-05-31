module.exports = {
  ONE_HOST: 'http://wufazhuce.com/', // ONE的web版网站
  // MOJI_HOST: "https://tianqi.moji.com/weather/china/shaanxi/chang'an-district", // 中国墨迹天气url
  MOJI_HOST: 'https://tianqi.moji.com/weather/china/fujian/cangshan-district', // 中国墨迹天气url
  TEP_HOST: 'http://localhost:4000/temp', // 生成消息图片用的HTML模板页面
  TEP_PIC_NAME: '.png', // 生成的消息图片名
  // MEET_DAY: '2018,3,18', // 和她认识的那一天2016年6月1号
  MEET_DAY: '2019,4,6', // 和她认识的那一天2016年6月1号
  ALIAS: 'YJ', // 备注姓名
  GETUP_TIME: '30 10 6 * * *', // 每天发送第一条消息的时间，每天6点10分30秒发送
  // DRINK_TIME: [
  //   { time: '30 13 7 * * *', words: '起床喝水，排毒养颜' },
  //   { time: '30 10 8 * * *', words: '要准备上班啦，先喝杯水吧' },
  //   { time: '30 10 12 * * *', words: '听说午餐后喝水，能减负减肥' },
  //   { time: '30 30 14 * * *', words: '喝杯水，提神醒脑' },
  //   { time: '30 30 17 * * *', words: '晚饭前喝杯水，晚上吃的就少了' },
  //   { time: '30 0 22 * * *', words: '睡觉前也别忘了喝水' }
  // ]
  DRINK_TIME: [{
      time: '30 20 6 * * *',
      words: '起床喝水，排毒养颜'
    },
    {
      time: '30 13 7 * * *',
      words: '早上记得吃早饭哦'
    },
    {
      time: '30 50 7 * * *',
      words: '要准备上课啦，要好好听课哦'
    },
    {
      time: '30 45 8 * * *',
      words: '课间休息喽，喝杯水，提神醒脑'
    },
    {
      time: '30 40 9 * * *',
      words: '下课咯，赶紧换教室'
    },
    {
      time: '30 45 10 * * *',
      words: '课间休息喽，想我就给我发消息哦'
    },
    {
      time: '30 40 11 * * *',
      words: '下课了，要乖乖按时吃饭哦'
    },
    {
      time: '30 10 12 * * *',
      words: '听说午餐后喝水，能减负减肥'
    },
    {
      time: '30 20 12 * * *',
      words: 'dear，别忘了英语听力打卡'
    },
    {
      time: '30 00 13 * * *',
      words: '亲爱的，中午要记得午休哦'
    },
    {
      time: '30 00 14 * * *',
      words: '亲爱的，快起床集合了'
    },
    {
      time: '30 30 14 * * *',
      words: '想我要记得给我发消息....o(╯□╰)o'
    },
    {
      time: '30 30 17 * * *',
      words: '据说晚饭前喝杯水，晚上吃的就少了'
    },
    {
      time: '30 30 18 * * *',
      words: '姑娘，快要集合了，快收拾吧'
    },
    {
      time: '30 00 19 * * *',
      words: '姑娘7点到8点要好好学习哦'
    },
    {
      time: '30 00 20 * * *',
      words: '姑娘，学累了吧，休息休息'
    },
    {
      time: '30 30 21 * * *',
      words: '姑娘，该洗澡咯'
    },
    {
      time: '30 00 23 * * *',
      words: '睡觉前也别忘了喝水'
    }
  ]
};