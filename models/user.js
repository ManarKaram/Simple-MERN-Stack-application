const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');
const _ = require('lodash')


const saltSound = 7;
//const jwtSecret = "MySecret";

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }


}, {
    timestamps: true,

    toJSON: {
        virtuals: true,
        transform: doc => {
            return _.pick(doc, ["email", "password"])
        }
    }
})

UserSchema.methods.generateToken = function (expiresIn = '365d') {
    const userInstace = this;
    return sign({ userId: userInstace.id }, process.env.JWT_SECRET, { expiresIn })
}

UserSchema.pre('save', async function () {
    const userInstace = this;
    if (this.isModified('password')) {
        userInstace.password = await bcrypt.hash(userInstace.password, saltSound)
    }
})

UserSchema.statics.getUserFromToken = async function (token) {
    const User = this;
    const payload = await verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(payload.userId);
    if (!currentUser) throw new Error("User not found !!")
    return currentUser
}

//methods on instance of User 
UserSchema.methods.comparePassword = async function (plainPassword) {
    const userInstace = this;
    return bcrypt.compare(plainPassword, userInstace.password)
}
//m3a el populate
// UserSchema.virtual('products',
//     {
//         ref: 'Product',
//         localField: '_id',
//         //m3a el ref ele fl products
//         foreignField: 'user'
//     })

const User = mongoose.model('User', UserSchema);
module.exports = User;
