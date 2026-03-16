import API from './axiosInstance';

export const fetchUserHeatmap = async () => {
  const response = await API.get('/stats/heatmap');
  return response.data;
};
