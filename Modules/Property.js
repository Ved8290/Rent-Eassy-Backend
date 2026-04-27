const mongoose = require('mongoose');
const { notify } = require('../Routes/Auth');

const propertySchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true
    },
    numberOfRooms: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true 
    },
    owner: {
        type: String,
        required: true
    }

});

const property = mongoose.model('Property', propertySchema);

module.exports = property;