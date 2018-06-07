const validator = require('validator')

const {mongoose} = require('./../mongo-connect')

const User = mongoose.model('User', {
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            },
            message: '{VALUE} is not a valid email' 
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
})

module.exports = {User}