const validator = require('validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

const {mongoose} = require('./../mongo-connect')

const UserSchema = new mongoose.Schema({
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

// hash password before saving
UserSchema.pre('save', function(next) {
    const user = this
    // generate salt
    bcrypt.genSalt(10, (err, salt) => {
        // hash password
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            next()
        })
    })
    
})

UserSchema.methods.toJSON = function() {
    const user = this
    return _.pick(user, ['_id', 'email'])
}

UserSchema.statics.findByLoginDetails = function (email, password) {
     var User = this
     return User.findOne({email}).then(user => {
        if(!user){
            return Promise.reject('Invalid details provided')
        }
        
        return new Promise((resolve, reject) => {
            // compare password -> if true, return promise so, then can be used in calling function
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user)
                }else{
                    reject('Invalid details provided')
                }
            })
        })
    })
}

const User = mongoose.model('User', UserSchema)

module.exports = {User}