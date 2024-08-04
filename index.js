const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('data', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const Person = require('./models/person')
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(person => {
    res.json(person)
  })
})

app.put('/api/persons/:id', (req, res) => {
  const newPerson = req.body
  Person.findByIdAndUpdate(
    req.params.id, 
    newPerson,
    { new: true, runValidators: true, context: 'query' }
  ).then(person => {
    res.json({
      id: req.params.id,
      name: person.name,
      number: newPerson.number
    })
  })
})

app.post('/api/persons/', (req, res, next) => {
  const newPerson = req.body
  if (newPerson.name == undefined && newPerson.number == undefined) {
    return res.status(400).json({ error: 'The content is missing' })
  }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number,
  })
  person.save().then(newPerson => {
    res.json(newPerson)
  }).catch(error => next(error))
})

app.get('/api/info', (req, res) =>{
  const time = new Date()
  Person.find({}).then(persons => {
    res.send('<p>Phonebook has info for '
            + persons.length.toString()
            + ' persons.<br>'
            + time.toString()
            + '</p>')
  })
})

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})