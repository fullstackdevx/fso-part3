require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))

app.use(cors())
app.use(express.json())

morgan.token('post-data', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : null })

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['post-data'](req, res)
    ].join(' ')
}))

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        person ? response.json(person) : response.status(404).end()
    })
})

app.post('/api/persons', (request, response) => {
    const body = { ...request.body }
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: `${!body.name && !body.number ? 'name & number' : (!body.name ? 'name' : 'number')} missing`
        })
    }

    const person = new Person({ ...body })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})