const express = require('express')

// exercise: 1.09
const PORT = 3000
const app = express()
app.listen(PORT, () => console.log(`:::: ping-pong-app :: server is listening @ ${PORT}`))

let counter = 0

app.get('/count', (req, res) => {
	// note: I am not incrementing counter here.
	return res.send(`pong ${String(counter === -1 ? 0 : counter)}, (path: ${req.path})`)
})

app.get('*', (req, res) => {
	counter += 1
	console.log(counter)
	// i a printing req.path to test if path rewrite is done or not!
	return res.send(`pong ${String(counter)}, (path: ${req.path})`)
})

// app.get('*', (req, res) => {
// 	return res.send(`wrong path in ping-pong app ${req.path}`)
// })
