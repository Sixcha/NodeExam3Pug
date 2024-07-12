const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

mongoose.connect('mongodb://localhost:27017/artisan', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const User = require('./models/User');
const Material = require('./models/Material');
const Furniture = require('./models/Furniture');

const materials = require('./routes/materials');
const furniture = require('./routes/furniture');

app.use('/api/materials', materials);
app.use('/api/furniture', furniture);
app.use('/css', express.static(path.join(__dirname, 'public/css')));

app.use(session({
  secret: 'Soleil',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/artisan' })
}));

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  const user = await User.findOne({ username });
  if (user && user.password === password) {
    req.session.userId = user._id;
    return res.redirect('/admin');
  }
  res.redirect('/login');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/admin');
    }
    res.redirect('/login');
  });
});

app.get('/admin', requireLogin, async (req, res) => {
  const materials = await Material.find();
  res.render('admin', {materials});
});

app.post('/admin/furniture', requireLogin, async (req, res) => {
  const { name, category, materials, quantity } = req.body;
  const newFurniture = new Furniture({ name, category, materials, quantity });
  await newFurniture.save();
  res.redirect('/admin');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/furniture', async (req, res) => {
  const furnitures = await Furniture.find().populate('materials');
  res.render('furniture', { furnitures });
});

// app.get('/materials', async (req, res) => {
//   const materials = await Material.find();
//   res.render('materials', { materials });
// });

app.get('/material/:id', async (req, res) => {
  const materialId = [req.params.id];
  const material = await Material.findById(materialId);
  const furnitureUsingMaterial = await Furniture.find({ 
    materials:{$all : materialId }}).populate('materials');
  console.log(furnitureUsingMaterial)
  console.log(materialId)

  const furnitureCount = await Furniture.countDocuments({ materials: req.params.id });
  res.render('material', { material, furnitureUsingMaterial });
});

app.get('/materials-usage', async (req, res) => {
  try {
    const materials = await Material.find();
    const furniture = await Furniture.find().populate('materials');

    const usedMaterials = {};

    materials.forEach(material => {
      usedMaterials[material.name] = 0;
    });

    furniture.forEach(item => {
      item.materials.forEach(material => {
        usedMaterials[material.name] += item.quantity;
      });
    });

    res.json(usedMaterials);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
