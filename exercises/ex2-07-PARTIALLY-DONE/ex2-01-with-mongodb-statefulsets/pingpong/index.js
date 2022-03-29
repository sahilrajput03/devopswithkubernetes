const express = require('express')
const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/db-project1')
mongoose.connect('mongodb://mongo1-svc:27017/db-project1')
// collection name = pongs, property name = notesList
const PongsM = mongoose.model('pongs', {title: String, counter: Number})

// exercise: 1.09
const PORT = 3000
const app = express()
app.listen(PORT, () => console.log(`:::: ping-pong-app :: server is listening @ ${PORT}`))

//  NOW I AM storing in mongodb!
let counter = 0

app.get('/count', async (req, res) => {
	// note: I am not incrementing counter here.

	const pongs = await PongsM.findOne({title: 'pongs_count'})
	let counter
	if (pongs) {
		counter = pongs.counter
	} else {
		counter = 0
	}

	return res.send(`pong ${String(counter === -1 ? 0 : counter)}, (path: ${req.path})`)
})

let filter = {title: 'pongs_count'}

app.get('*', async (req, res) => {
	let counter

	// to get the document:
	const pongs = await PongsM.findOne() // this fetches the first doc!
	if (pongs) {
		console.log('counter:(db):', pongs.counter) // {title: 'pongs_count', counter: 1}
		counter = pongs.counter + 1
		const NewPongs = await PongsM.findOneAndUpdate(filter, {title: 'pongs_count', counter}, {new: true})
		console.log('counter:(db, after update):', NewPongs.counter)
	} else {
		console.log('CREATING NEW DOCUMENT COZ ITS FIRST TIME!')
		// create new!
		const pongsI = new PongsM({title: 'pongs_count', counter: 1}) // I stands for Instance.
		const pongsDoc = await pongsI.save()
		counter = pongsDoc.counter // this would be 1, as it comes from above saved document.
	}

	// i am printing req.path to test if path rewrite is done or not!
	return res.send(`pong ${String(counter)}, (path: ${req.path})`)
})

// app.get('*', (req, res) => {
// 	return res.send(`wrong path in ping-pong app ${req.path}`)
// })
