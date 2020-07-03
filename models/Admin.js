const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const router = express.Router();

const AdminSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min:8,
        max:1024
    },
    role: {
        type: String,
        required: true,
    }
});


module.exports = mongoose.model('Admin',AdminSchema);
