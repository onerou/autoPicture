const axios = require('axios')
let url = 'https://aai.qcloud.com/asr/v1/'
module.exports = function(info, callback) {
	let param = {
		projectid: 'Vs1wc2Zv8ku0uc8g1BCxTjicKq6HD8pH', // 用户在腾讯云注册账号的 AppId，可以进入 API密钥管理页面 获取
		// sub_service_type: xxx, // 子服务类型。0：录音文件识别
		// engine_model_type: xxx, // 引擎类型。8k_0：电话 8k 通用模型；16k_0：16k 通用模型；8k_6: 电话场景下单声道话者分离模型
		// callback_url: xxx, // 	子服务类型。0：录音文件识别
		// channel_num: xxx, // 语音声道数，1：单声道；2：双声道（仅在电话 8k 通用模型下支持）
		res_text_format: 'UTF-8', // 识别结果文本编码方式。0：UTF-8；1：GB2312；2：GBK；3：BIG5
		// res_type: xxx, // 结果返回方式。 1：同步返回；0：尾包返回
		source_type: 1, // 语音数据来源。0：语音 URL；1：语音数据（post body）
		// url: xxx, // 语音的URL地址，需要公网可下载。长度小于2048字节，当 source_type 值为 0 时须填写该字段，为 1 时不需要填写
		secretid: 'AKIDJbgYCkq76sTpujdacOuCcokBMW9XtdJi', // 用户在腾讯云注册账号 AppId 对应的 SecretId，可以进入 API 密钥管理页面 获取
		// timestamp: xxx, // 当前 UNIX 时间戳，可记录发起 API 请求的时间。如果与当前时间相差过大，会引起签名过期错误。可以取值为当前请求的系统时间戳即可
		// expired: xxx, // 签名的有效期，是一个符合 UNIX Epoch 时间戳规范的数值，单位为秒；Expired 必须大于 Timestamp 且 Expired - Timestamp 小于90天。
		nonce: '4567815465778' // 随机正整数。用户需自行生成，最长10位
	}
	axios.post(url, param).then((res) => {
		callback(res.data.text)
	})
}
