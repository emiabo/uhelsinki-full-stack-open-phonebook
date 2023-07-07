const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    // If ID was sent in an unrecognized format to an ID-specific handler (get, delete, or put)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'bad ID' })
    }

    next(error)
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(errorHandler)

let people = [
]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
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
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res) => {
    Person.findByIdAndUpdate(req.params.id, { number: req.params.number })
        .then(result => {
            console.log(result)
            res.json(result)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({}).then(people => {
        res.send(`<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server live on port ${PORT}. http://localhost:3001/`)
})