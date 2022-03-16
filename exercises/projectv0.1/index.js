const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World, Sahil!')
})

app.listen(port, () => {
  console.log(`${new Date().toISOString()} ::APP STATUS::Example app listening on port ${port}`)
})
