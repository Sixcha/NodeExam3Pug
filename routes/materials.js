const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

router.post('/', async (req, res) => {
    const material = new Material(req.body);
    await material.save();
    res.send(material);
});

router.get('/', async (req, res) => {
    const materials = await Material.find();
    res.send(materials);
});

router.get('/:id', async (req, res) => {
    const material = await Material.findById(req.params.id);
    res.send(material);
});

module.exports = router;