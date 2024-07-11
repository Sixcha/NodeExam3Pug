const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


mongoose.connect('mongodb://localhost:27017/artisan', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const Material = require('./models/Material');
const Furniture = require('./models/Furniture');

const materials = require('./routes/materials');
const furniture = require('./routes/furniture');

app.use('/api/materials', materials);
app.use('/api/furniture', furniture);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/furniture', async (req, res) => {
  const furnitures = await Furniture.find().populate('materials');
  res.render('furniture', { furnitures });
});

app.get('/materials', async (req, res) => {
  const materials = await Material.find();
  res.render('materials', { materials });
});

app.get('/material/:id', async (req, res) => {
  const material = await Material.findById(req.params.id);
  res.render('material', { material });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
