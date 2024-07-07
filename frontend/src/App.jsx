import React, { useEffect, useState } from 'react';
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
        const usersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        const users = usersResponse.data;
        if (users.length > 0) {
          const firstUserId = users[0]._id;
          const tokenResponse = await axios.get(`${process.env.REACT_APP_API_URL}/token/${firstUserId}`);
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
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
