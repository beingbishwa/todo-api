const express = require('express')

const {mongoose} = require('./../db/mongo-connect')
const {Todo} = require('./../db/collections/todo')

const app = express()

/**
 * GET /todos
 * get all todos
 */
app.get('/todos', (req, res) => {
    Todo.find().then(data => {
        if(data.length > 0) res.status(200).send({data})
        else {
            res.status(200).send({
                message: 'No todos available'
            })
        }
    }).catch(err => {
        res.status(400).send({
            message: 'An error occured. Try Again'
        })
    })
})

// const newTodo = new Todo({
//     text: 'Hello',
//     completed: true
// })

// newTodo.save().then((doc) => {
//     console.log('Saved todo successfully')
//     console.log(doc)
// }).catch((e) => {
//     console.log('Unable to save todo')
// })

app.listen(3000, () => {
    console.log('Connection established on port 3000')
})