import axios from 'axios';
import {getCookie} from 'cookies-next'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  withCredentials: true, 
});



// Add request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = getCookie('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;