var mysql = require('mysql')
var { parseTime } = require('./index')

const initMysql = (
	{
		host = 'rm-8vbak71itwnhnn62qxo.mysql.zhangbei.rds.aliyuncs.com',
		user = 'root',
		password = 'Hc19940617',
		port = '3306',
		database = 'webchart'
	} = {}
) => {
	return mysql.createConnection({
		host,
		user,
		password,
		port,
		database
	})
}

function search(message) {
	let connection = initMysql()
	connection.connect()
	var sql = `SELECT answer FROM talk where regx='${message}'`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR search] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			let answerText = result[0] ? result[0].answer : '我不太清楚你在说什么'
			connection.end()
			resolve(answerText)
		})
	})
}

function insert(regx, answerText) {
	let connection = initMysql()
	connection.connect()
	var sql = `insert into talk(regx,answer) values('${regx}','${answerText}');`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			let answerText = result.insertId ? '好的' : '我不太清楚你在说什么'
			connection.end()
			resolve(answerText)
		})
	})
}

function setTodoText(userName, time, todo) {
	let connection = initMysql()
	connection.connect()
	var sql = `insert into todo_table(userName,time,todo) values('${userName}','${time}','${todo}');`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR setTodoText] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			let answerText = result.insertId ? '好的' : '我不太清楚你在说什么'
			connection.end()
			resolve(answerText)
		})
	})
}

function getTodoList() {
	let connection = initMysql()
	connection.connect()
	var sql = `SELECT * FROM todo_table;`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR getTodoList] - ${parseTime(new Date().getTime())}`, err.message)
				resolve(false)
			}
			connection.end()
			if (result instanceof Array) resolve(result)
			resolve([])
		})
	})
}
function removeTodoById(id) {
	let connection = initMysql()
	connection.connect()
	var sql = `DELETE FROM todo_table where id='${id}';`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR removeTodoById] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			connection.end()
			resolve('删除成功')
		})
	})
}
function removeTodoByTime(userName, time) {
	let connection = initMysql()
	connection.connect()
	var sql = `DELETE FROM todo_table where time='${time}' and userName='${userName}';`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR removeTodoByTime] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			connection.end()
			resolve('删除成功')
		})
	})
}

function getRestartUser() {
	let connection = initMysql()
	connection.connect()
	var sql = `SELECT * FROM restart;`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR getRestartUser] - ${parseTime(new Date().getTime())}`, err.message)
				resolve(false)
			}
			connection.end()
			if (result instanceof Array) resolve(result)
			resolve([])
		})
	})
}
function setRestartUser(userName, time) {
	let connection = initMysql()
	connection.connect()
	var sql = `insert into restart(userName,time) values('${userName}','${time}');`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR setRestartUser] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			resolve(true)
		})
		connection.end()
	})
}
function setNewsUser(user, title = '') {
	let connection = initMysql()
	connection.connect()
	var sql = `insert into new_user(user,lastTitle) values('${user}','${title}');`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR setRestartUser] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			resolve(true)
		})
		connection.end()
	})
}
function getNewsUser() {
	let connection = initMysql()
	connection.connect()
	var sql = `SELECT * FROM new_user;`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR setRestartUser] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			resolve(result)
		})
		connection.end()
	})
}
function changeNewsTitle(user, title) {
	let connection = initMysql()
	connection.connect()
	var sql = `UPDATE new_user SET lastTitle = '${title}' WHERE user = '${user}';`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR setRestartUser] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			resolve(true)
		})
		connection.end()
	})
}
function addSubscribeUser({ name, time, formCity, toCity }) {
	let connection = initMysql()
	connection.connect()
	var sql = `insert into subscribe_user(name,time,formCity,toCity) values('${name}','${time}','${formCity}','${toCity}');`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR setRestartUser] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			resolve('已关注')
		})
		connection.end()
	})
}
function getSubscribeUserAllList(user, option) {
	let connection = initMysql()
	connection.connect()
	var sql = `SELECT * FROM subscribe_user;`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR setRestartUser] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			resolve(result)
		})
		connection.end()
	})
}
function getSubscribeUserListByName(name) {
	let connection = initMysql()
	connection.connect()
	var sql = `SELECT * FROM subscribe_user where name='${name}';`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR setRestartUser] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			resolve(result)
		})
		connection.end()
	})
}
function removeSubscribeUserByTime(name, time) {
	let connection = initMysql()
	connection.connect()
	var sql = `DELETE FROM subscribe_user where name='${name}' and time='${time}';`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR removeTodoByTime] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			connection.end()
			resolve('已删除')
		})
	})
}
function removeSubscribeUserById(name, id) {
	let connection = initMysql()
	connection.connect()
	var sql = `DELETE FROM subscribe_user where name='${name}' and id='${id}';`
	return new Promise((resolve, reject) => {
		connection.query(sql, function(err, result) {
			if (err) {
				console.log(`[SELECT ERROR removeTodoByTime] - ${parseTime(new Date().getTime())}`, err.message)
				resolve('数据库错误，请联系管理员')
			}
			connection.end()
			resolve('已删除')
		})
	})
}
module.exports = {
	search,
	insert,
	setTodoText,
	getTodoList,
	removeTodoById,
	removeTodoByTime,
	getRestartUser,
	setRestartUser,
	setNewsUser,
	getNewsUser,
	changeNewsTitle,
	addSubscribeUser,
	getSubscribeUserAllList,
	getSubscribeUserListByName,
	removeSubscribeUserByTime,
	removeSubscribeUserById
}
