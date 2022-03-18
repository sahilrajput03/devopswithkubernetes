const express = require('express')

// exercise: 1.09
const PORT = 3000
const app = express()
app.listen(PORT, () => console.log(`:::: ping-pong-app :: server is listening @ ${PORT}`))

let counter = -1

app.get('*', (req, res) => {
	// app.get('*', (req, res) => {
	// ^^^ I am listening on all paths, this is good for TESTING and learning!
	counter += 1
	// i a printing req.path to test if path rewrite is done or not!
	return res.send(`pong ${String(counter)}, (path: ${req.path})`)
})

// app.get('*', (req, res) => {
// 	return res.send(`wrong path in ping-pong app ${req.path}`)
// })
