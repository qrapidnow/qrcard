const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let users = [{ _id: '1', name: 'John Doe' }];
let restaurants = [{ _id: '1', name: 'Sample Restaurant' }];
let categories = [{ _id: '1', name: 'Appetizers', restaurantId: '1' }];
let items = [
  { _id: '1', name: 'Spring Rolls', categoryId: '1', image: 'spring-rolls.jpg' }
];

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/token/:userId', (req, res) => {
  res.json({ token: 'sample-token-for-user-' + req.params.userId });
});

app.get('/restaurants', (req, res) => {
  res.json(restaurants[0]);
});

app.get('/categories/:restaurantId', (req, res) => {
  const restaurantCategories = categories.filter(category => category.restaurantId === req.params.restaurantId);
  res.json(restaurantCategories);
});

app.get('/items/:categoryId', (req, res) => {
  const categoryItems = items.filter(item => item.categoryId === req.params.categoryId);
  res.json(categoryItems);
});

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(Server listening on port http://localhost:${port});
});
