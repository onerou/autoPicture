var exec = require('child_process').exec
var cmd = 'node task/searchclass.js'
exec(cmd, function(error, stdout, stderr) {
	console.log('error', error)
	console.log('TCL: stdout', stdout)
	console.log('TCL: stderr', stderr)
})
