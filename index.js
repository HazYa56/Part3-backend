const express = require('express')
const morgan = require("morgan")
const cors = require('cors')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

const Person = require('./models/person')
app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    }).catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(person => {
    res.json(person)
  })
})

app.put('/api/persons/:id', (req, res) => {
  const newPerson = req.body;
  if (newPerson.number == undefined) {
    return res.status(400).json({ error: 'The number is missing' })
  }
  Person.findByIdAndUpdate(req.params.id, newPerson).then(person => {
    res.json({
      id: req.params.id,
      name: person.name,
      number: newPerson.number
    })
  })
})

app.post('/api/persons/', (req, res) => {
  const newPerson = req.body;
  if (newPerson.name == undefined && newPerson.number == undefined) {
    return res.status(400).json({ error: 'The content is missing' })
  }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number,
  })
  person.save().then(newPerson => {
    res.json(newPerson)
  })
})

app.get("/api/info", (req, res) =>{
  const time = new Date()
  Person.find({}).then(persons => {
    res.send("<p>Phonebook has info for "
            + persons.length.toString()
            + " persons.<br>"
            + time.toString()
            + "</p>")
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})