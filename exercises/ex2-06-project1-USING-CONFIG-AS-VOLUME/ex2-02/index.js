const express = require('express')
const cors = require('cors')

// TODO: fix the port!
const PORT = 3001
const app = express()
app.listen(PORT, () => console.log(`::::server is listening @ ${PORT}`))
app.use(cors())
app.use(express.json())

let log

let todos = []

app.post('/api/todos', (req, res) => {
	const todo = req.body.todo
	console.log('received todo: ', todo)
	todos.push(todo)
	return res.json(todos)
})

app.get('/api/todos', (req, res) => {
	res.json(todos)
})
