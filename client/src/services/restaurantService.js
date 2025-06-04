// import axios from './api';

// const RESTAURANT_BASE = '/restaurants';

// export const getRestaurants = async (filters = {}) => {
//   const response = await axios.get(RESTAURANT_BASE, { params: filters });
//   return response.data;
// };

// export const getRestaurantById = async (id) => {
//   const response = await axios.get(`${RESTAURANT_BASE}/${id}`);
//   return response.data;
// };

// export const createRestaurant = async (restaurantData) => {
//   const response = await axios.post(RESTAURANT_BASE, restaurantData);
//   return response.data;
// };

// export const updateRestaurant = async (id, restaurantData) => {
//   const response = await axios.put(`${RESTAURANT_BASE}/${id}`, restaurantData);
//   return response.data;
// };

// export const deleteRestaurant = async (id) => {
//   const response = await axios.delete(`${RESTAURANT_BASE}/${id}`);
//   return response.data;
// };
import api from './api';

// Simple object-based approach
const restaurantService = {
  async getRestaurants(params = {}) {
    try {
      const queryParams = new URLSearchParams();
            
      if (params.search) queryParams.append('search', params.search);
      if (params.cuisine) queryParams.append('cuisine', params.cuisine);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
            
      const response = await api.get(`/restaurants?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  async getRestaurant(id) {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  },

  async createRestaurant(data) {
    try {
      const response = await api.post('/restaurants', data);
      return response.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  },

  async updateRestaurant(id, data) {
    try {
      const response = await api.put(`/restaurants/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  },

  async deleteRestaurant(id) {
    try {
      const response = await api.delete(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  },

  // Add this method for menu items
  async addMenuItem(data) {
    try {
      const response = await api.post('/menu-items', data);
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  async getMenuItems(restaurantId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const response = await api.get(`/restaurants/${restaurantId}/menu-items?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  async updateMenuItem(id, data) {
    try {
      const response = await api.put(`/menu-items/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  },

  async deleteMenuItem(id) {
    try {
      const response = await api.delete(`/menu-items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  },

  async getCuisines() {
    try {
      const response = await api.get('/cuisines');
      return response.data;
    } catch (error) {
      console.error('Error fetching cuisines:', error);
      return [
        { id: 1, name: 'Italian' },
        { id: 2, name: 'Chinese' },
        { id: 3, name: 'Mexican' },
        { id: 4, name: 'Indian' },
        { id: 5, name: 'American' },
        { id: 6, name: 'Thai' },
        { id: 7, name: 'Japanese' },
        { id: 8, name: 'Mediterranean' }
      ];
    }
  },

  async uploadImages(restaurantId, files) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
            
      const response = await api.post(`/restaurants/${restaurantId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  async getRestaurantAnalytics(id) {
    try {
      const response = await api.get(`/restaurants/${id}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
};

export default restaurantService;


