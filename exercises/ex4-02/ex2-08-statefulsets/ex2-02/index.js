const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/db-project1')
// mongoose.connect('mongodb://mongo-svc:27017/db-project1')

let healthy = false
let failedDbMessg = {message: 'failed to connect to db ...'}

console.log('db uri ~sahil: ', process.env.DB_URI)

// This was required to do ex4-01
let connectWithRetry = function () {
	// mongoose
	// 	.connect('mongodb://localhost:27017/db-project1')
	mongoose
		.connect(process.env.DB_URI)
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

// collection name = notes, property name = notesList
const NoteM = mongoose.model('notes', {note: String})

// TODO: fix the port!
const PORT = 3001
const app = express()
app.listen(PORT, () => console.log(`::::server is listening @ ${PORT}`))
app.use(cors())
app.use(express.json())

app.get('/healthz', (req, res) => {
	console.log('req@/healthz, pingpong', healthy)
	if (!healthy) {
		console.log(failedDbMessg)
		return res.status(500).json(failedDbMessg)
	}

	return res.status(200).send('ok')
})

let log

// now saving to database.

app.post('/api/todos', async (req, res) => {
	const todo = req.body.todo
	console.log('received todo: ', todo)

	const note = new NoteM({note: todo})
	// note.save().then(() => console.log('notes added!'))
	const noteDoc = await note.save()
	console.log('saved : ', noteDoc.note)

	const notes = await NoteM.find({})

	return res.json(notes.map((doc) => doc.note))
})

app.get('/api/todos', async (req, res) => {
	const notes = await NoteM.find({})
	console.log(
		'all notes',
		notes.map((doc) => doc.note)
	)

	res.json(notes.map((doc) => doc.note))
})
