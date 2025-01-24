import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_API_BASE_URL + '/api'
      : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // Ensure JSON is the default content type
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Error:', error);
    return Promise.reject(error);
  }
);
