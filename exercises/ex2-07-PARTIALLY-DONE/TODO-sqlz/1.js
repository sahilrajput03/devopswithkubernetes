const Note = require('./models/Note')

const js = JSON.stringify

module.exports = async () => {
	await Note.sync()

	console.log('saved to the database!'.bm)
	// ? This creates the User table it already doesn't exist. Read its docs for more.

	const jane = await Note.create({
		notes: ['Joe'],
	})
	console.log(js(jane, null, 2).bm)
	// Jane exists in the database now!
}
