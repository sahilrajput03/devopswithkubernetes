const fs = require('fs')
const express = require('express')

// exercise: 1.09
const PORT = 3001
// NOTE: ^^^^^^^^ NO TWO SERVICES CAN HAVE SAME PORTS, IDK WHY EXACTLY.
// TODO: CHECKOUT :: PROBABLY: THEY ARE RUNNING IN SAME CONTAINER >?? IDK ACTUALLY!!
const app = express()
app.listen(PORT, () => console.log(`:::: ping-pong-app :: server is listening @ ${PORT}`))

let counter = -1

const writeToDisk = (c) => {
	try {
		fs.writeFileSync('/usr/src/app/files/pong.txt', String(c))
		//file written successfully
	} catch (err) {
		console.error(err)
	}
}

app.get('*', (req, res) => {
	// app.get('*', (req, res) => {
	// ^^^ I am listening on all paths, this is good for TESTING and learning!

	counter += 1
	writeToDisk(counter)
	console.log('WRITTEN TO DISK: ', counter)
	// i a printing req.path to test if path rewrite is done or not!
	return res.send(`pong ${String(counter)}, (path: ${req.path})`)
})

// app.get('*', (req, res) => {
// 	return res.send(`wrong path in ping-pong app ${req.path}`)
// })
