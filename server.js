const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/TodoApp')

// make todo model
const Todo = mongoose.model('Todo', {
    text:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

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