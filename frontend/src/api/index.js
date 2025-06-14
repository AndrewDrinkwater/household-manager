import axios from 'axios';

const API_URL = 'http://localhost:4000/api';
const UPLOADS_URL = 'http://localhost:4000/uploads';

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

// --- Users ---
// CHANGE createUser endpoint to /register for safe password hashing
export const getUsers    = () => axios.get(`${API_URL}/users`);
export const createUser  = data => axios.post(`${API_URL}/register`, data);
export const updateUser  = (id, data) => axios.put(`${API_URL}/users/${id}`, data);
export const deleteUser  = id => axios.delete(`${API_URL}/users/${id}`);

// --- Attachments ---
// Upload an attachment for a service
export const uploadAttachment = (serviceId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/services/${serviceId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// List all attachments for a service
export const getAttachments = (serviceId) =>
  axios.get(`${API_URL}/services/${serviceId}/attachments`);

// Delete an attachment by its ID
export const deleteAttachment = (attachmentId) =>
  axios.delete(`${API_URL}/attachments/${attachmentId}`);

// Expose the base uploads URL for image/file preview/download
export { UPLOADS_URL };

// --- Cars ---
export const getCars = () => axios.get(`${API_URL}/cars`);
export const getCar = (id) => axios.get(`${API_URL}/cars/${id}`);
export const getFullCar = (id) => axios.get(`${API_URL}/cars/${id}/full`);
export const createCar = (data) => axios.post(`${API_URL}/cars`, data);
export const updateCar = (id, data) => axios.put(`${API_URL}/cars/${id}`, data);
export const deleteCar = (id) => axios.delete(`${API_URL}/cars/${id}`);

// --- MOTs ---
export const getMots = (carId) => axios.get(`${API_URL}/cars/${carId}/mots`);
export const createMot = (carId, data) => axios.post(`${API_URL}/cars/${carId}/mots`, data);
export const updateMot = (id, data) => axios.put(`${API_URL}/mots/${id}`, data);
export const deleteMot = (id) => axios.delete(`${API_URL}/mots/${id}`);

// --- Insurances ---
export const getInsurances = (carId) => axios.get(`${API_URL}/cars/${carId}/insurances`);
export const createInsurance = (carId, data) => axios.post(`${API_URL}/cars/${carId}/insurances`, data);
export const updateInsurance = (id, data) => axios.put(`${API_URL}/insurances/${id}`, data);
export const deleteInsurance = (id) => axios.delete(`${API_URL}/insurances/${id}`);

// --- ServiceRecords ---
export const getServiceRecords = (carId) => axios.get(`${API_URL}/cars/${carId}/service-records`);
export const createServiceRecord = (carId, data) => axios.post(`${API_URL}/cars/${carId}/service-records`, data);
export const updateServiceRecord = (id, data) => axios.put(`${API_URL}/service-records/${id}`, data);
export const deleteServiceRecord = (id) => axios.delete(`${API_URL}/service-records/${id}`);

// --- CarTaxes ---
export const getCarTaxes = (carId) => axios.get(`${API_URL}/cars/${carId}/car-taxes`);
export const createCarTax = (carId, data) => axios.post(`${API_URL}/cars/${carId}/car-taxes`, data);
export const updateCarTax = (id, data) => axios.put(`${API_URL}/car-taxes/${id}`, data);
export const deleteCarTax = (id) => axios.delete(`${API_URL}/car-taxes/${id}`);

// --- MileageRecords ---
export const getMileageRecords = (carId) => axios.get(`${API_URL}/cars/${carId}/mileage-records`);
export const createMileageRecord = (carId, data) => axios.post(`${API_URL}/cars/${carId}/mileage-records`, data);
export const updateMileageRecord = (id, data) => axios.put(`${API_URL}/mileage-records/${id}`, data);
export const deleteMileageRecord = (id) => axios.delete(`${API_URL}/mileage-records/${id}`);
