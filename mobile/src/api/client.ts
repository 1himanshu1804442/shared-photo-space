import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For Android emulator to hit localhost, use 10.0.2.2. For iOS simulator, use localhost.
// Replace with your local machine's IP address if testing on a physical device.
const API_URL = Platform.OS === 'web' ? 'http://localhost:8080/api' : 'http://10.254.210.167:8080/api';

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use(async (config) => {
  console.log(`[DEBUG] Phone is attempting to request: ${config.baseURL}${config.url}`);
  let token = null;
  if (Platform.OS === 'web') {
    token = localStorage.getItem('token');
  } else {
    token = await SecureStore.getItemAsync('token');
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
