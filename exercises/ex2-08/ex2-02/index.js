const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/db-project1')
mongoose.connect('mongodb://mongo-svc:27017/db-project1')
// collection name = notes, property name = notesList
const NoteM = mongoose.model('notes', {note: String})

// TODO: fix the port!
const PORT = 3001
const app = express()
app.listen(PORT, () => console.log(`::::server is listening @ ${PORT}`))
app.use(cors())
app.use(express.json())

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
