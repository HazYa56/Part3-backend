const express = require('express')
const app = express()
app.use(express.json())

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
  newPerson.id = Math.round(Math.random()*1e5).toString()
  persons = persons.concat(newPerson)
})

app.get("/api/info", (req, res) =>{
  const time = new Date()
  res.send("<p>Phonebook has info for "
           + persons.length.toString()
           + " persons.<br>"
           + time.toString()
           + "</p>")
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})