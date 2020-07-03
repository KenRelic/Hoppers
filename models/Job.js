// MODEL FOR API ONLY jobs
const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    position: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    description: {
        type: Object,
        required: true
    },
    role_requirement:{
        type: Object,
        required: true
    },
    perks: {
        type: Object
    }
});


module.exports = mongoose.model('Job',JobSchema);