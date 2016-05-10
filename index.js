
// https://nodejs.org/api/events.html
const EventEmitter = require('events')
const http = require('http')
const util = require('util')
const exec = require('child_process').exec

function GitWebhooks(options) {
	EventEmitter.call(this)

	// console.log('GitWebhooks.createServer', options)
	options.PORT = options.PORT || 3333

	var server = http.createServer((request, response) => {
		console.log('requesting...', request.url)

		var payload = []
		request.on('data', (chunk) => {
			payload.push(chunk)
		}).on('end', () => {
			// console.log('request end')
			
			payload = Buffer.concat(payload).toString()
			payload = JSON.parse(payload)
			this.emit('payload', request, response, payload)

		}).on('error', console.error)
	})

	server.listen(options.PORT, () => {
		this.emit('listening', options.PORT)
	})

	this.server = server
}
util.inherits(GitWebhooks, EventEmitter);

/*
	runs a command on the command line
*/
GitWebhooks.command = function(commandString){
	console.log('GitWebhooks.command', commandString)

	return new Promise((resolve, reject) => {
		exec(commandString, (error, stdout, stderr) => {
			if(error) {
				// console.error('ERROR', error.message)
				reject(error)
				return
			}
			// console.log('stdout', stdout)
			resolve(stdout)
		})
	})
}

module.exports = GitWebhooks
