import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Menu.css';
import FoodItemCard from './FoodItemCard';

const Menu = ({ addItem, updateItemCount }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndItems = async () => {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('restaurantId');
      if (!token || !restaurantId) {
        console.error('Token or restaurant ID not found in localStorage');
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }
      try {
        const categoriesResponse = await axios.get(${process.env.REACT_APP_API_URL}/categories/${restaurantId}, {
          headers: {
            Authorization: Bearer ${token}
          }
        });
        const categories = categoriesResponse.data;
        const sectionsWithItems = await Promise.all(
          categories.map(async (category) => {
            const itemsResponse = await axios.get(${process.env.REACT_APP_API_URL}/items/${category._id}, {
              headers: {
                Authorization: Bearer ${token}
              }
            });
            return {
              title: category.name,
              items: itemsResponse.data.map(item => ({
                ...item,
                image: ${process.env.REACT_APP_API_URL}/uploads/${item.image}
              }))
            };
          })
        );
        setSections(sectionsWithItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories or items:', error);
        setError('Error loading menu. Please try again later.');
        setLoading(false);
      }
    };

    fetchCategoriesAndItems();
  }, []);

  if (loading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="menu">
      {sections.map((section) => (
        <div key={section.title} className="menu-section">
          <h2>{section.title}</h2>
          <div className="menu-items-container">
            <div className="menu-items">
              {section.items.map((item) => (
                <FoodItemCard key={item._id} item={item} addItem={addItem} updateItemCount={updateItemCount} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
