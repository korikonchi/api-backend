const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
// app support request make when pass a object and parsing JSON PARSE
const requestLogger = require('./loggerMiddleware')
app.use(requestLogger)
//  middleware use object request and response,rememeber request in side of client  are storen in object request can manipulate with (express.json) and add to object request as request.body
// who  origins can acces our resources
let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript test nodemon',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

// import modules common js
app.get('/', (request, response) => {
  response.send(`
<h1>hello world</h1>
`)
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }
  console.log(note)
  // json-parser take JSON files to request and transform on javscript object and adjunt to the property body request
  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)
  // crete dynamic id
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  notes = [...notes, newNote]
  response.status(201).json(newNote)
})
app.use((request, response) => {
  response.status(404).json({
    error: 'not found'
  })
  console.log('other use')
})
//  if not work app.use before this middleware allows us send a error

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
