const fs = require('fs')
const express = require('express')

const readFromDisk = () => {
	try {
		const data = fs.readFileSync('/usr/src/app/files/hash.txt', 'utf8')
		console.log('READ FROM DISK:', data)
		return data
	} catch (err) {
		console.error(err)
	}
}
// Ex 1.07
const PORT = 3000
const app = express()
app.listen(PORT, () => console.log(`::::server is listening @ ${PORT}`))

let log // to be read from file system now!

app.get('*', (req, res) => {
	return res.send(req.path + ' ,' + readFromDisk())
})
