import axios from 'axios';
import Config from './config.json';

const api = axios.create({
  baseURL: Config.BACKEND_URL
});

api.interceptors.request.use(cfg => {
  if (global.token) cfg.headers.Authorization = `Bearer ${global.token}`;
  return cfg;
});

export default api;
