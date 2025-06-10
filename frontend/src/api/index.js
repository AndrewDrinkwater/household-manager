// frontend/src/api/index.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// --- Categories ---
export const getCategories    = () => axios.get(`${API_URL}/categories`);
export const createCategory   = data => axios.post(`${API_URL}/categories`, data);
export const updateCategory   = (id, data) => axios.put(`${API_URL}/categories/${id}`, data);
export const deleteCategory   = id => axios.delete(`${API_URL}/categories/${id}`);

// --- Subcategories ---
export const getSubcategories  = () => axios.get(`${API_URL}/subcategories`);
export const createSubcategory = data => axios.post(`${API_URL}/subcategories`, data);
export const updateSubcategory = (id, data) => axios.put(`${API_URL}/subcategories/${id}`, data);
export const deleteSubcategory = id => axios.delete(`${API_URL}/subcategories/${id}`);

// --- Vendors ---
export const getVendors    = () => axios.get(`${API_URL}/vendors`);
export const createVendor  = data => axios.post(`${API_URL}/vendors`, data);
export const updateVendor  = (id, data) => axios.put(`${API_URL}/vendors/${id}`, data);
export const deleteVendor  = id => axios.delete(`${API_URL}/vendors/${id}`);

// --- Frequencies ---
export const getFrequencies  = () => axios.get(`${API_URL}/frequencies`);
export const createFrequency  = (data) => axios.post(`${API_URL}/frequencies`, data);
export const updateFrequency  = (id, data) => axios.put(`${API_URL}/frequencies/${id}`, data);
export const deleteFrequency  = (id) => axios.delete(`${API_URL}/frequencies/${id}`);


// --- Services (formerly Contracts) ---
export const getServices      = () => axios.get(`${API_URL}/services`);
export const createService    = data => axios.post(`${API_URL}/services`, data);
export const updateService    = (id, data) => axios.put(`${API_URL}/services/${id}`, data);
export const deleteService    = id => axios.delete(`${API_URL}/services/${id}`);

// --- Legacy “Contracts” aliases ---
export const getContracts   = getServices;
export const createContract = createService;
export const updateContract = updateService;
export const deleteContract = deleteService;

// after Vendors...
// --- Users ---
export const getUsers    = () => axios.get(`${API_URL}/users`);
export const createUser  = data => axios.post(`${API_URL}/users`, data);
export const updateUser  = (id, data) => axios.put(`${API_URL}/users/${id}`, data);
export const deleteUser  = id => axios.delete(`${API_URL}/users/${id}`);
