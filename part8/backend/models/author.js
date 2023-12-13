const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    born: {
        type: Number,
        default: 0
    },
})

authorSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Author', authorSchema)