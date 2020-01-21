async function getOneData(page) {
	const oneData = await getOneDetail(page)
	return oneData
}

// 获取 one·一个 的数据
async function getOneDetail(page) {
	const carousel_inner = await page.$('.carousel-inner')
	const activeItem = await carousel_inner.$('.active')
	const oneImg = await activeItem.$eval('.fp-one-imagen', (img) => img.src)
	const oneWords = await activeItem.$eval('.fp-one-cita', (div) => div.innerText)
	let cont = await page.evaluate(() => {
		let A = Array.from(document.querySelectorAll('.corriente a'))
		return A.map((v) => {
			return {
				text: v.innerText,
				url: v.href
			}
		})
	})
	return {
		oneImg,
		oneWords,
		cont
	}
}

module.exports = getOneData
