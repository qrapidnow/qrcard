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
[3:14 pm, 07/07/2024] Rajat K VJTI: import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Navbar from './components/NavBar';
import Menu from './components/Menu';
import CartItem from './components/CartItem';

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCartItem, setShowCartItem] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUsersAndToken = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:3001/users');
        const users = usersResponse.data;
        if (users.length > 0) {
          const firstUserId = users[0]._id;
          const tokenResponse = await axios.get(http://localhost:3001/token/${firstUserId});
          const token = tokenResponse.data.token;
          if (token) {
            localStorage.setItem('token', token);
            const restaurantResponse = await fetchRestaurant(token);
            localStorage.setItem('restaurantId', restaurantResponse._id);
          }
        }
      } catch (error) {
        console.error('Error fetching users or token:', error);
      }
    };

    fetchUsersAndToken();
  }, []);

  const fetchRestaurant = async (token) => {
    try {
      const response = await axios.get('http://localhost:3001/restaurants', {
        headers: { Authorization: Bearer ${token} }
      });
      setRestaurantName(response.data.name);
      setIsLoggedIn(true);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  };

  const addItem = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const getTotalItems = () => cart.length;

  const handleViewOrderClick = () => setShowCartItem(true);
  const handleCartClick = () => setShowCartItem((prev) => !prev);

  const removeItem = (itemToRemove) => {
    setCart((prevCart) => prevCart.filter((item) => item !== itemToRemove));
  };

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Header restaurantName={restaurantName} />
      <div className="search-cart-container">
        <SearchBar />
        <button className="cart-button" onClick={handleCartClick}>🛒</button>
      </div>
      <Navbar />
      <div className="content-container">
        <Menu addItem={addItem} />
      </div>
      {getTotalItems() > 0 && (
        <div className="view-order-bar" onClick={handleViewOrderClick}>
          <span>View Order</span>
          <span className="order-count">{getTotalItems()}</span>
        </div>
      )}
      {showCartItem && (
        <div className="cart-item-container">
          <CartItem
            cartItems={cart}
            removeItem={removeItem}
          />
        </div>
      )}
    </div>
  );
};

export default App;
