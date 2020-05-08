const mongoose = require('mongoose');
const _ = require('lodash');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
},
    {
        toJSON: {
            virtuals: true,
            transform: doc => {
                return _.pick(doc, ["name", "id"])
            }
        }
    })


const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;