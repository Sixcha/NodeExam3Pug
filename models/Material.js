const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    name: String,
    company: String
});

module.exports = mongoose.model('Material', MaterialSchema);