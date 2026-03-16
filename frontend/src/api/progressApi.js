import API from './axiosInstance';

export const fetchDashboardStats = async () => {
  const response = await API.get('/progress/stats');
  return response.data;
};
