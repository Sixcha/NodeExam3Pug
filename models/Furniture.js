const mongoose = require('mongoose');

const FurnitureSchema = new mongoose.Schema({
    name: String,
    category: String,
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
    keywords: [String]
});

module.exports = mongoose.model('Furniture', FurnitureSchema);