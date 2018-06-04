const express = require('express')

const {mongoose} = require('./../db/mongo-connect')
const {Todo} = require('./../db/collections/todo')

const app = express()

const newTodo = new Todo({
    text: 'Hello',
    completed: true
})

newTodo.save().then((doc) => {
    console.log('Saved todo successfully')
    console.log(doc)
}).catch((e) => {
    console.log('Unable to save todo')
})

app.listen(3000, () => {
    console.log('Connection established on port 3000')
})