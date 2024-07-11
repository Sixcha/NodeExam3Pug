const express = require('express');
const router = express.Router();
const Furniture = require('../models/Furniture');

router.post('/', async (req, res) => {
    const furniture = new Furniture(req.body);
    await furniture.save();
    res.send(furniture);
});

router.get('/', async (req, res) => {
    const furnitures = await Furniture.find().populate('materials');
    res.send(furnitures);
});

router.get('/:id', async (req, res) => {
    const furniture = await Furniture.findById(req.params.id).populate('materials');
    res.send(furniture);
});

router.get('/keyword/:keyword', async (req, res) => {
    const furnitures = await Furniture.find({ keywords: req.params.keyword }).populate('materials');
    res.send(furnitures);
});

module.exports = router;
