import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('restaurantId');
      if (!token || !restaurantId) {
        console.error('Token or restaurant ID not found in localStorage');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3001/categories/${restaurantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="navbar">
      <ul>
        {categories.map((category) => (
          <li key={category._id}>{category.name}</li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
