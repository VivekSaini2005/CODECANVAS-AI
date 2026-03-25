import API from './axiosInstance';

export const fetchUserHeatmap = async () => {
  const response = await API.get('/stats/heatmap');
  return response.data;
};

export const fetchUserPlatformStats = async () => {
  const response = await API.get('/stats/stored');
  return response.data;
};

export const syncUserPlatformStats = async () => {
  const response = await API.post('/stats/sync-all');
  return response.data;
};
