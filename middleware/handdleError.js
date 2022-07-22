module.exports = (error, request, response, next) => {
  console.log(error)
  console.log(error.name)
  if (error.name === 'castError') {
    response.status(400).send({ error: 'id used is malformed' }).end()
  } else {
    response.status(500).send({ error: 'id used not exist' }).end()
  }
}
