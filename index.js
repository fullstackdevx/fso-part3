const express = require('express')

const app = express()

app.use(express.json())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }]

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    person ? response.json(person) : response.status(404).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    if (!newPerson.name || !newPerson.number) {
        return response.status(400).json({
            error: `${!newPerson.name && !newPerson.number ? 'name & number' : (!newPerson.name ? 'name' : 'number')} missing`
        })
    } else if (newPerson.name && persons.find(person => person.name === newPerson.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    newPerson.id = generateId()
    persons = persons.concat(newPerson)

    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})