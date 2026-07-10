const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Custom request helper that handles fetching data, attaching tokens, and formatting errors.
 */
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: options.method || 'GET',
    headers,
    ...options,
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  } else if (options.body && options.body instanceof FormData) {
    // Let browser set content-type for FormData (including boundaries)
    delete config.headers['Content-Type'];
    config.body = options.body;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      // If unauthorized, clear token and redirect (optional, context will handle)
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    console.error(`API request error on ${endpoint}:`, error.message);
    throw error;
  }
};

// Export explicit service API requests
export const api = {
  // Authentication
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: data }),
    login: (data) => request('/auth/login', { method: 'POST', body: data }),
    getMe: () => request('/auth/me'),
  },
  
  // Resumes
  resume: {
    upload: (formData) => request('/resume/upload', { method: 'POST', body: formData }),
    uploadText: (data) => request('/resume/upload', { method: 'POST', body: data }),
    getHistory: () => request('/resume/history'),
    getById: (id) => request(`/resume/${id}`),
    delete: (id) => request(`/resume/${id}`, { method: 'DELETE' }),
  },

  // Job Matching
  job: {
    match: (data) => request('/job/match', { method: 'POST', body: data }),
    getHistory: () => request('/job/history'),
  },

  // Mock Interviews
  interview: {
    start: (data) => request('/interview/start', { method: 'POST', body: data }),
    evaluate: (data) => request('/interview/evaluate', { method: 'POST', body: data }),
    getHistory: () => request('/interview/history'),
    getById: (id) => request(`/interview/${id}`),
  },

  // Dashboard Statistics
  dashboard: {
    getData: () => request('/dashboard'),
  },

  // Admin Dashboard
  admin: {
    getStats: () => request('/admin/stats'),
    getUsers: () => request('/admin/users'),
    updateRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: { role } }),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  },

  // Recruiter Screening
  recruiter: {
    screen: (formData) => request('/recruiter/screen', { method: 'POST', body: formData }),
    getHistory: () => request('/recruiter/history'),
    getById: (id) => request(`/recruiter/run/${id}`),
  }
};
