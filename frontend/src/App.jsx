import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Navbar from './components/NavBar';
import Menu from './components/Menu';
import Cart from './components/Cart';
import CartItem from './components/CartItem';
import axios from 'axios';

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCartItem, setShowCartItem] = useState(false);
  const [foodItemCounts, setFoodItemCounts] = useState({});
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUsersAndToken = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:3001/users');
        const users = usersResponse.data;
        if (users.length > 0) {
          const firstUserId = users[0]._id;
          const tokenResponse = await axios.get(`http://localhost:3001/token/${firstUserId}`);
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
    updateItemCount(item.id, 1);
  };

  const getTotalItems = () => cart.length;

  const handleViewOrderClick = () => setShowCartItem(true);
  const handleCartClick = () => {
    setShowCart(true);
    setShowCartItem(true);
  };
  const handleCartItemToggle = () => setShowCartItem((prev) => !prev);

  const removeItem = (itemToRemove) => {
    setCart((prevCart) => prevCart.filter((item) => item !== itemToRemove));
    updateItemCount(itemToRemove.id, -itemToRemove.quantity);
  };

  const updateItemCount = (itemId, countChange) => {
    setFoodItemCounts((prevCounts) => {
      const currentCount = prevCounts[itemId] || 0;
      return { ...prevCounts, [itemId]: Math.max(0, currentCount + countChange) };
    });
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
        <Menu addItem={addItem} updateItemCount={updateItemCount} />
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
            setCart={setCart}
            removeItem={removeItem}
            setShowCartItem={setShowCartItem}
            updateItemCount={updateItemCount}
          />
        </div>
      )}
    </div>
  );
};

export default App;
