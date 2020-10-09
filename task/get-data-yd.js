const axios = require('axios') 
var getYdWord = async function(words) {
    let res = await axios.get("http://dict.youdao.com/infoline/style/cardList?style=daily&apiversion=3.0&client=mobile")
    let todayData = res.data[0];  //要今天的
    let ydWord = {  
        chinese: todayData.summary, //这是中文
        english: todayData.title,   //这是英语
        image: todayData.image[0],  //图片
        mp3: todayData.voice,       //发音
        source: todayData.source?"———— "+todayData.source:'',    //出自哪里
        videourl:todayData.videourl,
        audiourl:todayData.audiourl
    }
    return ydWord
  }
  
  module.exports = getYdWord