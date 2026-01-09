const API_BASE_URL = 'http://localhost:5000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Income API
export const incomeAPI = {
  addIncome: (incomeData) => apiRequest('/income/add', {
    method: 'POST',
    body: JSON.stringify(incomeData),
  }),
  
  getHistory: () => apiRequest('/income/history'),
};

// Bucket API
export const bucketAPI = {
  getAll: () => apiRequest('/bucket/all'),
  
  addBucket: (bucketData) => apiRequest('/bucket/add', {
    method: 'POST',
    body: JSON.stringify(bucketData),
  }),
  
  updateBucket: (id, bucketData) => apiRequest(`/bucket/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bucketData),
  }),
  
  deleteBucket: (id) => apiRequest(`/bucket/delete/${id}`, {
    method: 'DELETE',
  }),
};

// Expense API
export const expenseAPI = {
  getHistory: () => apiRequest('/expense/history'),
  
  addExpense: (expenseData) => apiRequest('/expense/add', {
    method: 'POST',
    body: JSON.stringify(expenseData),
  }),
  
  deleteExpense: (id) => apiRequest(`/expense/delete/${id}`, {
    method: 'DELETE',
  }),
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => apiRequest('/dashboard/summary'),
};

export default {
  income: incomeAPI,
  bucket: bucketAPI,
  expense: expenseAPI,
  dashboard: dashboardAPI,
};
