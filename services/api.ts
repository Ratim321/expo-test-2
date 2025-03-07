import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for handling refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await localStorage.getItem('refreshToken');
        const response = await api.post('/api/users/token/refresh/', {
          refresh: refreshToken,
        });

        const { access } = response.data;
        await localStorage.setItem('accessToken', access);

        // Update the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout the user
        await localStorage.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/users/login/', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/api/users/register/', userData);
    return response.data;
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await api.post('/api/users/verify-otp/', { email, otp });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/api/users/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/users/profile/');
    return response.data;
  },

  updateProfile: async (profileData: any) => {
    const response = await api.patch('/api/users/profile/', profileData);
    return response.data;
  },
};

export default api;