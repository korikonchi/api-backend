const mongoose = require('mongoose')
const url = process.env.MONGO_DB_URI
// mongoose conection data base
mongoose.connect(url, {
}).then(
  () => { console.log('data base conected') }).catch(e => { console.log(e) })

// process.on('uncaughtException', () => {
//   mongoose.connection.disconnect()
// })
// when has error connection server close
