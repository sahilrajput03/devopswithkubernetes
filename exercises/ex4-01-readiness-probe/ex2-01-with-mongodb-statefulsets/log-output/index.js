const express = require('express')
const axios = require('axios')

// Ex 1.07
const PORT = 3000
const app = express()
app.listen(PORT, () => console.log(`::::server is listening @ ${PORT}`))

let log

app.get('/healthz', async (req, res) => {
	try {
		// i am making health of this pod (actually container) dependent on the pingpong-pod (actually pingpong-container).
		const data = await axios.get('http://pingpong-svc:2346/healthz')
		console.log('request @ ', req.path, ', response::', data.data)
		// const data = await axios.get('http://localhost:3005/healthz')
		return res.status(200).send('ok')
	} catch (e) {
		console.log('request @ ', req.path, `@catch:${String(e)}`)
		return res.status(500).json('health is not good :(   CRY !')
	}
})

app.get('/', async (req, res) => {
	// todo: make request @ below addr to fetch the pongs count:
	// http://pingpong-svc:2346
	try {
		const {data} = await axios.get('http://pingpong-svc:2346/count')
		// const {data} = await axios.get('http://localhost:3005/count')
		console.log('count:', data)
		return res.send(` (path: ${req.path}) ${log}
		<br/>
			${String(data)}`)
	} catch (e) {
		// console.log(e)

		const err = 'Got error: ' + String(e.message)
		console.log(err)
		return res.send(err)
	}

	// old code
	// return res.send(req.path + ' ,' + log)
})

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
	log = 'Good Luck -' + new Date().toISOString() + ' ' + longHash()

	//TODO: undow below loggg.. URGENT ex4-01
	// console.log(log)
	setTimeout(printString, 5000)
}

printString()
