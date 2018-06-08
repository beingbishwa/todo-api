const validator = require('validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
})

// hash password before saving
UserSchema.pre('save', function(next) {
    const user = this
    // generate salt
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            // hash password
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
    
})

UserSchema.methods.toJSON = function() {
    const user = this
    return _.pick(user, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function() {
    const user = this
    const access = 'auth'
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.SECRET_KEY).toString()

    user.tokens.push({access, token})

    return user.save().then(() => {
        return token
    })
}

UserSchema.methods.removeToken = function (token) {
    const user = this
    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

UserSchema.statics.findByLoginDetails = function (email, password) {
     const User = this
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

UserSchema.statics.findByToken = function (token) {
    const User = this
    let decoded

    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        return Promise.reject('Unauthorized')
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }).then(user => {
        if(!user){
            return Promise.reject('Unauthorized')
        }else{
            return Promise.resolve(user)
        }
    })
}

const User = mongoose.model('User', UserSchema)

module.exports = {User}