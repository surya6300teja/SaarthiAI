import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',  // Match your backend server port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const resumeService = {
  create: (data) => api.post('/resumes', data),
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
};

export const portfolioService = {
  create: (data) => api.post('/portfolios', data),
  getAll: () => api.get('/portfolios'),
  getById: (id) => api.get(`/portfolios/${id}`),
  update: (id, data) => api.put(`/portfolios/${id}`, data),
  delete: (id) => api.delete(`/portfolios/${id}`),
};

export const jobService = {
  create: (data) => api.post('/jobs', data),
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  apply: (id) => api.post(`/jobs/${id}/apply`),
  getApplications: () => api.get('/applications'),
};

export default api; 