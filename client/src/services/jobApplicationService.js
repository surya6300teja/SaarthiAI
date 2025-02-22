import axios from 'axios';

const API_URL = '/api/v1/job-applications';

export const getJobApplications = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addJobApplication = async (applicationData) => {
  const response = await axios.post(API_URL, applicationData);
  return response.data;
};

export const deleteJobApplication = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}; 