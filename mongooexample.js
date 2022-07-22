// example code mongoose important!!!!
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://Mongodbkorikonchi:${password}@danycluster.ioror.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})
// schema as types object
const Note = mongoose.model('Note', noteSchema)
// create model monggose name and schema is a collection but Mongoldb use plural notes

// const note = new Note({
//   content: 'HTML is Easy',
//   date: new Date(),
//   important: true
// })
// note is a instance of class Note model mongoose

// note.save().then(result => {
//   console.log(result)
//   mongoose.connection.close()
// }).catch(e => {
//   console.log(e)
// })

Note.find({}).then(result => {
  result.forEach(note => { console.log(note) })
  mongoose.connection.close()
}).catch(e => {
  console.log(e)
})
