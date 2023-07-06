const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

let people = [
]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    Person.findById(request.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name or number missing'
        })
    } else if (people.find(person => person.name == body.name)) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    people = people.filter(person => person.id !== id)
    res.status(204).end()
})

app.get('/info', (req, res) => {
    Person.find({}).then(people => {
        res.send(`<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}`)
})