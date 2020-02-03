const answer = require('./answerOption')
const { search } = require('../utils/MySql')
module.exports = (message, name, from) => {
	for (value of answer) {
		if (value[0].exec(message)) {
			return value[1](value[0], message, name, from)
		}
	}
	return search(message)
}
