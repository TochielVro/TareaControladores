import axios from 'axios';
const API_URL = 'http://localhost:3001/api/ventas';

export const getVentas = () => axios.get(API_URL);
export const getVentaById = (id) => axios.get(`${API_URL}/${id}`);
export const createVenta = (data) => axios.post(API_URL, data);