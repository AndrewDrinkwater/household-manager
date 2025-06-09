import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const getVendors = () => axios.get(`${API_URL}/vendors`);
export const createVendor = (data) => axios.post(`${API_URL}/vendors`, data);

export const getUsers = () => axios.get(`${API_URL}/users`);
export const createUser = (data) => axios.post(`${API_URL}/users`, data);

export const getContracts = () => axios.get(`${API_URL}/contracts`);
export const createContract = (data) => axios.post(`${API_URL}/contracts`, data);

export const updateContract = (id, data) =>
  axios.put(`${API_URL}/contracts/${id}`, data);

export const deleteContract = (id) =>
  axios.delete(`${API_URL}/contracts/${id}`);
