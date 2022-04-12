const {connect, JSONCodec} = require('nats')
const jc = JSONCodec()

// import { connect, Payload } from 'ts-nats';
// TODO: above import.
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/db-project1')
// mongoose.connect('mongodb://mongo-svc:27017/db-project1')

let healthy = false
let failedDbMessg = {message: 'failed to connect to db ...'}
let log = console.log

log('db uri ~sahil: ', process.env.DB_URI)

// This was required to do ex4-01
let connectWithRetry = function () {
	// mongoose
	// 	.connect('mongodb://localhost:27017/db-project1')
	mongoose
		.connect(process.env.DB_URI)
		.then(() => {
			log(':::::::: +> connected to mongodb SUCCESSFUL!')
			healthy = true
		})
		.catch((e) => {
			healthy = false // this would work like cherry on top say in case your `db container` or `db service` is down in any distant future time at any instant in future so setting `healthy` as false will make the regular `readinessProbe` test fail which depends on the variable `healthy`.
			log(':::::: -> connection to mongodb UNsuccessful!')

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
app.listen(PORT, () => log(`::::server is listening @ ${PORT}`))
app.use(cors())
app.use(express.json())

app.get('/healthz', (req, res) => {
	log('req@/healthz, pingpong', healthy)
	if (!healthy) {
		log(failedDbMessg)
		return res.status(500).json(failedDbMessg)
	}

	return res.status(200).send('ok')
})

// you can visit : http://localhost:8081/crash from the host computer to crash the server intentionall to test `livenessProbe`.
app.get('/crash', (req, res) => {
	log('>>>Intentionally crash server to test livenessProbe, i.e., this container/pod will be restarted when noticed by livenessProbe anytime soon.')
	res.send('crashing the app usin `process.exit(1)` and livenessProbe will restart the container.')

	process.exit(1)
})

// now saving to database.

app.post('/api/todos', async (req, res) => {
	const todo = req.body.todo
	log('received todo: ', todo)

	const note = new NoteM({note: todo})
	// note.save().then(() => log('notes added!'))
	const noteDoc = await note.save()
	log('saved : ', noteDoc.note)

	let staticProperties = {
		userId: null,
		createdAt: new Date().toString(),
		updatedAt: new Date().toString(),
	}

	sendTaskToNATS('created', {task: noteDoc.note, done: true, id: noteDoc._id, ...staticProperties})

	const notes = await NoteM.find({})

	return res.json(notes.map((doc) => doc.note))
})

app.get('/api/todos', async (req, res) => {
	const notes = await NoteM.find({})
	log(
		'all notes',
		notes.map((doc) => doc.note)
	)

	res.json(notes.map((doc) => doc.note))
})

// TODO: add strong typing and remove type assertions

const NATS_URL = process.env['NATS_URL'] || undefined // Setting a url implies enabling NATS

const natsStatus = NATS_URL ? `NATS is enabled: ${NATS_URL}` : `NATS is disabled`
console.log('::::natsStatus:::', natsStatus)

async function sendTaskToNATS(action, task) {
	// action: 'created' | 'updated' | 'deleted'
	// task: {task: 'task1', done: true, id: 'some-string-id'}
	try {
		const nc = await connect({servers: NATS_URL})
		// const nc = await connect({
		// 	url: NATS_URL,
		// 	payload: Payload.JSON,
		// })

		const updatedTask = task
		nc.publish(`todos.${action}`, jc.encode(updatedTask))

		await nc.flush()

		nc.close()
	} catch (error) {
		if (error instanceof Error) {
			console.error('NATS error:', error.message)
		} else {
			throw error
		}
	}
}
