const fs = require('fs')
const express = require('express')

// TODO: now i need to read the pingpong's count:
const readFromDisk = () => {
	try {
		const data = fs.readFileSync('/usr/src/app/files/pong.txt', 'utf8')
		console.log('READ FROM DISK:', data)
		return data
	} catch (err) {
		console.error(err)
		return 'NOT WRITTEN YET! TRY HITTING PING PONG APP first!'
	}
}

// Ex 1.07
const PORT = 3000
const app = express()
app.listen(PORT, () => console.log(`::::server is listening @ ${PORT}`))

let log

// 8-4-4-12
const longHash = () => {
	const s1 = Math.random().toString(36).substr(2, 10)
	const s2 = Math.random().toString(36).substr(2, 6)
	const s3 = Math.random().toString(36).substr(2, 6)
	const s4 = Math.random().toString(36).substr(2, 10) + Math.random().toString(36).substr(2, 6)
	const s = [s1, s2, s3, s4].join('-')

	return s
}

const printString = () => {
	log = 'Good Luck - ' + new Date().toISOString() + ' ' + longHash()

	setTimeout(printString, 5000)
}

printString()

app.get('*', (req, res) => {
	return res.send(`
	log-output: ${log}
	<br/>
	Ping / Pongs: ${readFromDisk()}
	<br/>
	Path: ${req.path}
	`)
})
