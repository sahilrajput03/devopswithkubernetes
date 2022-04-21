const express = require('express')
const Fs = require('fs')
const Path = require('path')
const Axios = require('axios')
const app = express()
const port = 3000

app.use(express.json())

const quotes = [
	'2024',
	'All you have to be is yourself',
	'Believe in your flyness...conquer your shyness.',
	'Burn that excel spread sheet',
	'Decentralize',
	'Distraction is the enemy of vision',
	'Everything you do in life stems from either fear or love',
	'For me giving up is way harder than trying.',
	'For me, money is not my definition of success. Inspiring people is a definition of success',
	'Fur pillows are hard to actually sleep on',
	"George Bush doesn't care about black people",
	'Have you ever thought you were in love with someone but then realized you were just staring in a mirror for 20 minutes?',
	'I care. I care about everything. Sometimes not giving a f#%k is caring the most.',
	'I feel calm but energized',
	"I feel like I'm too busy writing history to read it.",
	'I feel like me and Taylor might still have sex',
	'I give up drinking every week',
	'I leave my emojis bart Simpson color',
	"I love sleep; it's my favorite.",
	'I make awesome decisions in bike stores!!!',
	"I really love my Tesla. I'm in the future. Thank you Elon.",
	'I still think I am the greatest.',
	"I think I do myself a disservice by comparing myself to Steve Jobs and Walt Disney and human beings that we've seen before. It should be more like Willy Wonka...and welcome to my chocolate factory.",
	'I want the world to be better! All I want is positive! All I want is dopeness!',
	'I wish I had a friend like me',
	"I'd like to meet with Tim Cook. I got some ideas",
	"I'll say things that are serious and put them in a joke form so people can enjoy them. We laugh to keep from crying.",
	"I'm a creative genius",
	"I'm nice at ping pong",
	"I'm the best",
	"If I don't scream, if I don't say something then no one's going to say anything.",
	'If I got any cooler I would freeze to death',
	'Just stop lying about shit. Just stop lying.',
	'Keep squares out yo circle',
	'Keep your nose out the sky, keep your heart to god, and keep your face to the rising sun.',
	"Let's be like water",
	'Man... whatever happened to my antique fish tank?',
	'My dad got me a drone for Christmas',
	"My greatest award is what I'm about to do.",
	'My greatest pain in life is that I will never be able to see myself perform live.',
	"One day I'm gon' marry a porn star",
	"One of my favorite of many things about what the Trump hat represents to me is that people can't tell me what to do because I'm black",
	'Only free thinkers',
	"People always say that you can't please everybody. I think that's a cop-out. Why not attempt it? Cause think of all the people that you will please if you try.",
	"People always tell you 'Be humble. Be humble.' When was the last time someone told you to be amazing? Be great! Be awesome! Be awesome!",
	'People only get jealous when they care.',
	'Perhaps I should have been more like water today',
	'Pulling up in the may bike',
	'Shut the fuck up I will fucking laser you with alien fucking eyes and explode your fucking head',
	'Sometimes I push the door close button on people running towards the elevator. I just need my own elevator sometimes. My sanctuary.',
	'Sometimes you have to get rid of everything',
	'Style is genderless',
	'The thought police want to suppress freedom of thought',
	'The world is our family',
	'The world is our office',
	"Today is the best day ever and tomorrow's going to be even better",
	"Truth is my goal. Controversy is my gym. I'll do a hundred reps of controversy for a 6 pack of truth",
	'Tweeting is legal and also therapeutic',
	"We all self-conscious. I'm just the first to admit it.",
	"We came into a broken world. And we're the cleanup crew.",
	"You can't look at a glass half full or empty if it's overflowing.",
	"I hate when I'm on a flight and I wake up with a water bottle next to me like oh great now I gotta be responsible for this water bottle",
]

app.get('/', (req, res) => {
	// console.log(process.env.DOTENV)

	/*
	 * :: Manually checking values from inside container:
	 *
	 * kubectl exec -it  project1-dep-7b6cdffcd9-fkrk7 -- sh
	 * /usr/src # node -e 'console.log(process.env.DOTENV)'
	 * message1=Hello
	 * message2=Hello world!
	 *
	 *
	 * NOTE: DOTENV comes from `deployment.yaml/.spec.template.spec.containers[0].env.name`
	 * console.log(process.env.DOTENV)
	 * OUTPUT:
	 *`message1=Hello
	 * message2=Hello world!`
	 *
	 * keys = ['message1=Hello', 'message2=Hello world!']
	 *
	 * env.message1 -> Hello
	 * env.message2 -> Hello world!
	 */

	let keys = process.env.DOTENV?.split('\n')
	let env = {}
	keys?.forEach((pair) => {
		// console.log(pair)
		const [key, value] = pair.split('=')
		env[key] = value
	})

	const response = `
	  <head>
		<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	  </head>
	  <body>

	  <script>
		console.log('script started runn..')
		async function clearListAndLoad(){
			let list = document.getElementById('list')
			// clear inner elements on page load!
			list.innerHTML = ''	
			// const {data} = await axios.get('http://localhost:3001/api/todos')
			const {data} = await axios.get('/api/todos')
			console.log('initial todos:', data)

			// Now put data in html:
			data.forEach( el => {
				let l = document.createElement('li')
				l.innerText = el
				list.appendChild(l)
			})
		}

		window.onload = clearListAndLoad // Execute a function on pageload.


		async function myFun(){
			const todo = document.getElementById('it').value
			// alert('hell'); 
			// const {data} = await axios.post('http://localhost:3001/api/todos', {todo})
			const {data} = await axios.post('/api/todos', {todo})
			console.log({data})

			let list = document.getElementById('list')
			list.innerHTML = ''	// src: https://stackoverflow.com/a/3955238/10012446
			data.forEach( el => {
				let l = document.createElement('li')
				l.innerText = el
				list.appendChild(l)
			})
		}
	  </script>
	  Hello World, Sahil!
	  <br/>
	  From environment: <b>env.messsage1: ${env.message1} </b>
	  <br/>
	  <h2>Today's thought:</h2>
	  ${quotes[Math.floor(Math.random() * quotes.length)]}
	  <br/>
	  <br/>
	  <img src='/img' width="300" height="400" />
	  <h3>Todos</h3>
	  <input id="it" /> <button onclick="myFun()">Create TODO</button>
	  <ul id='list'>
		  <!--<li>TODO 1</li>-->
		  <!--<li>TODO 2</li>-->
	  </ul>
	  <br/>
	  </body>
	  `
	res.send(response)
})

const directory = Path.join('/', 'usr', 'src', 'app', 'files')
const filepath = Path.join(directory, 'image.jpg')

// let filepath = Path.resolve(__dirname, 'image.jpg')

app.get('/img', async (req, res) => {
	// TODO: Only download image if its not there in storage!
	//
	console.log('route /img')

	try {
		if (Fs.existsSync(filepath)) {
			//file exists
			console.log('Image serving from storage..')
			return res.sendFile(filepath)
		} else {
			console.log('DOWNLOADING NEW IMAGE..')

			await downloadImage()

			return res.sendFile(filepath)
		}
	} catch (err) {
		console.error(err)
	}
})

app.get('*', (req, res) => {
	console.log('Sendng custom 404 message from project1')
	return res.send('Project 1, Page 404!')
})

app.listen(port, () => {
	console.log(`${new Date().toISOString()} ::APP STATUS::Example app listening on port ${port}`)
})

async function downloadImage() {
	const url = 'https://picsum.photos/1200'
	const writer = Fs.createWriteStream(filepath)

	const response = await Axios({
		url,
		method: 'GET',
		responseType: 'stream',
	})

	response.data.pipe(writer)

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve)
		writer.on('error', reject)
	})
}