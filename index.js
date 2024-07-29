const express = require('express')
const morgan = require("morgan")
const cors = require('cors')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  { 
    "id": "75123",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "89632",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "75963",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "85858",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find(person => person.id == req.params.id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(person => person.id != req.params.id).concat()
  res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
  const newPerson = req.body;
  if (newPerson.name !== undefined && newPerson.number !== undefined) {
    if (newPerson.name.trim() !== '' && newPerson.number.trim() !== '') {
      if (persons.map(person => newPerson.name == person.name).includes(true)) {
        res.send({ error: 'name must be unique' })
      } else {
        newPerson.id = Math.round(Math.random()*1e5).toString()
        persons = persons.concat(newPerson)
        res.json(newPerson)
      }
    } else {
      res.send({ error: 'The name or number is missing' })
    }
  } else {
    res.send({ error: 'The content is missing' })
  }
})

app.get("/api/info", (req, res) =>{
  const time = new Date()
  res.send("<p>Phonebook has info for "
           + persons.length.toString()
           + " persons.<br>"
           + time.toString()
           + "</p>")
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})