const mongoose = require('mongoose');

const ApplicationSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    current_company: {
        type: String
    },
    position_applying: {
        type: String,
        required: true
    },
    job_location:{
        type: String,
        required: true
    },
    cv: {

    }
});


module.exports = mongoose.model('Application', ApplicationSchema);