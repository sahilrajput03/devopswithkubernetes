const express = require('express')
const mongoose = require('mongoose')

let healthy = false

// This was required to do ex4-01
let connectWithRetry = function () {
	// mongoose
	// 	.connect('mongodb://localhost:27017/db-project1')
	mongoose
		.connect('mongodb://mongo1-svc:27017/db-project1')
		.then(() => {
			console.log(':::::::: +> connected to mongodb SUCCESSFUL!')
			healthy = true
		})
		.catch((e) => {
			healthy = false // this would work like cherry on top say in case your `db container` or `db service` is down in any distant future time at any instant in future so setting `healthy` as false will make the regular `readinessProbe` test fail which depends on the variable `healthy`.
			console.log(':::::: -> connection to mongodb UNsuccessful!')

			console.error(':::INFO_IMPORTANT:::retrying in 5 sec:::')
			setTimeout(connectWithRetry, 5000)
		})
}

connectWithRetry() // We need to do this coz say if the `db container` or `db service` is not up for some reason then the container would not attempt to retry to connect to db again.
// But with the `connectWithRetry` strategy it will attempt to connect to db even if the database service is up after after 10 or 15 minutes after the backend container is up!
// src: https://stackoverflow.com/a/26164828/10012446

// collection name = pongs, property name = notesList
const PongsM = mongoose.model('pongs', {title: String, counter: Number})

// exercise: 1.09
const PORT = 3000
const app = express()
app.listen(PORT, () => console.log(`:::: ping-pong-app :: server is listening @ ${PORT}`))

//  NOW I AM storing in mongodb!
let counter = 0

let failedDbMessg = {message: 'failed to connect to db ...'}

app.get('/healthz', (req, res) => {
	console.log('req@/healthz, pingpong', healthy)
	if (!healthy) {
		console.log(failedDbMessg)
		return res.status(500).json(failedDbMessg)
	}

	return res.status(200).send('ok')
})

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

app.get('/', async (req, res) => {
	let counter

	// to get the document:
	let pongs
	try {
		pongs = await PongsM.findOne() // this fetches the first doc!
	} catch (e) {
		console.log('endpoint *', failedDbMessg)
		return res.json(failedDbMessg)
	}
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
