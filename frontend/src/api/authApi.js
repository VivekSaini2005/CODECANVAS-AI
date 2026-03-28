import API from './axiosInstance';

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await API.put('/auth/update-profile', profileData);
  return response.data;
};

export const googleLoginUser = async (credential) => {
  const response = await API.post('/auth/google', { credential });
  return response.data;
};
