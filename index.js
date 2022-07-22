require('dotenv').config()
require('./mongo')
// init mongo
// add sentry
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')
// mongoose conection data base
app.use(cors())
// solution to CORS exchange resources cross origin
app.use(express.json())
// app support request make when pass a object and parsing JSON PARSE
app.use(express.static('build'))
//  ever express receiving a request verify if directory buld contain a file.
app.use('/images', express.static('images'))
//  ever express receiving a request verify if directory images contain a file /image.png.

const requestLogger = require('./loggerMiddleware')
const notFound = require('./middleware/notFound')
const handdleError = require('./middleware/handdleError')
app.use(requestLogger)
//  middleware use object request and response,rememeber request in side of client  are storen in object request can manipulate with (express.json) and add to object request as request.body
// who  origins can acces our resources
// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     date: '2019-05-30T17:30:31.098Z',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only Javascript test nodemon',
//     date: '2019-05-30T18:39:34.091Z',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     date: '2019-05-30T19:20:14.298Z',
//     important: true
//   }
// ]

// add sentry handler error
Sentry.init({
  dsn: 'https://fef7a18ef8b14c868ce5c406dda3b4f5@o1327530.ingest.sentry.io/6588641',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// import modules common js
app.get('/', (request, response) => {
  response.send(`
<h1>hello world</h1>
`)
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
  // response.json(notes) with express
})

app.get('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  // const note = notes.find((note) => note.id === id)
  Note.findById(id).then(note => {
    if (note) {
      return response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(error => {
    next(error)
    // next to middleware error
  })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  // notes = notes.filter((note) => note.id !== id)
  // moke data delete
  Note.findByIdAndDelete(id).then(() => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }
  // json-parser take JSON files to request and transform on javscript object and adjunt to the property body request
  // const ids = notes.map((note) => note.id)
  // const maxId = Math.max(...ids)
  // id: maxId + 1,
  // crete dynamic id

  const newNote = new Note({
    content: note.content || {},
    date: new Date(),
    important: note.important || false
  })
  // notes = [...notes, newNote] this make to modify array mock data
  newNote.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
})
app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body
  const UpdateNote = {
    content: note.content,
    important: note.important
  }
  // put method return update with {new:true}
  Note.findByIdAndUpdate(id, UpdateNote, { new: true }).then(update => {
    if (update) {
      return response.json(update)
    }
  }).catch(error => {
    next(error)
    // next to middleware error
  })
})

app.use(notFound)
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())
app.use(handdleError)
//  if not work app.use before this middleware allows us send a all error pass to midleware

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
