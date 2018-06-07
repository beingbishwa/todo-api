require('../config/config')

const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

const {mongoose} = require('./../db/mongo-connect')
const {Todo} = require('./../db/collections/todo')

const port = process.env.PORT || 3000
const app = express()

// parse incoming and outgoing contents
app.use(bodyParser.json())

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

/**
 * POST /todos
 * add a new todo
 */
app.post('/todos', (req, res) => {
    const newTodo = new Todo({
        text: req.body.text
    })

    newTodo.save().then(data => {
        res.status(200).send({data})
    }).catch(err => {
        res.status(400).send({
            message: 'An error occured.Try Again'
        })
    })
})

/**
 * GET /todo/:id
 * get individual todo
 */
app.get('/todo/:id', (req, res) => {
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        res.status(404).send({
            message: 'ID doesn\'t exist'
        })
    }
    Todo.findById(id).then(data => {
        if(!data){
            res.status(404).send({
                message: 'ID doesn\'t exist'
            })
        }else{
            res.status(200).send({data})
        }
    }).catch(err => {
        res.status(400).send({
            message: 'An error occured. Try Again'
        })
    })
})

/**
 * PATCH /todo/:id
 * update todo
 */
app.patch('/todo/:id', (req, res) => {
    // check if id is valid or not
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        res.status(404).send({
            message: 'ID doesn\'t exist'
        })
    }

    // construct new data 
    const newData = _.pick(req.body, ['text', 'completed'])
    if(_.isBoolean(newData.completed) && newData.completed){
        newData.completedAt = new Date().getTime()
    }else{
        newData.completedAt = null
    }
    
    // update data
    Todo.findByIdAndUpdate(id, {$set: newData}, {new: true}).then(data => {
        if(data){
            res.status(200).send({data})
        }else{
            res.status(404).send({
                message: 'ID doesn\'t exist'
            })
        }
    }).catch(err => {
        res.status(400).send({
            message: 'An error occured. Try Again'
        })
    })
})

/**
 * DELETE /todo/:id
 * delete individual todo
 */
app.delete('/todo/:id', (req, res) => {
    // validate id
    const id = req.params.id
    if(!ObjectID.isValid(id)){
        res.status(404).send({
            message: 'ID doesn\'t exist'
        })
    }

    // delete data
    Todo.findByIdAndRemove(id).then(data => {
        if(data){
            res.status(200).send({data})
        }else{
            res.status(404).send({
                message: 'ID doesn\'t exist'
            })
        }
    }).catch(err => {
        res.status(400).send({
            message: 'An error occured. Try Again'
        })
    })
})

/**
 * Start server on specified port
 */
app.listen(process.env.PORT, () => {
    console.log(`Connection established on port ${port}`)
})