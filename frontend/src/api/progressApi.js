import API from './axiosInstance';

export const fetchDashboardStats = async () => {
  const response = await API.get('/progress/stats');
  return response.data;
};

// Returns all sheets
export const fetchSheets = async () => {
  const response = await API.get('/sheets');
  return response.data;
};

// Returns problems for a given sheet id
export const fetchSheetProblems = async (sheetId) => {
  const response = await API.get(`/sheets/${sheetId}`);
  return response.data;
};

// Returns a Set of solved problem IDs for the current user
export const fetchSolvedProblemIds = async () => {
  const response = await API.get('/progress');
  const rows = response.data;
  const ids = new Set(rows.map(r => r.problem_id).filter(Boolean));
  return ids;
};
