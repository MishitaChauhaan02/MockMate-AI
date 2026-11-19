import axios from 'axios';
import {
  AuthResponse,
  User,
  Interview,
  InterviewDetail,
  InterviewSummary,
  DashboardStats,
  ProgressAnalytics,
  CreateInterviewPayload,
  SubmitAnswerPayload,
  Answer,
  Evaluation,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mockmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid/expired and not already on auth page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('mockmate_token');
        localStorage.removeItem('mockmate_user');
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth APIs ---
export const authApi = {
  register: async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      full_name: fullName,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (payload: { full_name?: string; current_password?: string; new_password?: string }): Promise<User> => {
    const response = await apiClient.patch<User>('/users/me', payload);
    return response.data;
  },
};

// --- Question APIs ---
export const questionApi = {
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/questions/categories');
    return response.data;
  },
};

// --- Interview APIs ---
export const interviewApi = {
  createInterview: async (payload: CreateInterviewPayload): Promise<InterviewDetail> => {
    const response = await apiClient.post<InterviewDetail>('/interviews', payload);
    return response.data;
  },

  getInterviews: async (): Promise<Interview[]> => {
    const response = await apiClient.get<Interview[]>('/interviews');
    return response.data;
  },

  getInterviewById: async (interviewId: number): Promise<InterviewDetail> => {
    const response = await apiClient.get<InterviewDetail>(`/interviews/${interviewId}`);
    return response.data;
  },

  submitAnswer: async (interviewId: number, payload: SubmitAnswerPayload): Promise<Answer> => {
    const response = await apiClient.post<Answer>(`/interviews/${interviewId}/submit-answer`, payload);
    return response.data;
  },

  completeInterview: async (interviewId: number): Promise<InterviewSummary> => {
    const response = await apiClient.post<InterviewSummary>(`/interviews/${interviewId}/complete`);
    return response.data;
  },
};

// --- Analytics APIs ---
export const analyticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/analytics/dashboard');
    return response.data;
  },

  getProgressAnalytics: async (): Promise<ProgressAnalytics> => {
    const response = await apiClient.get<ProgressAnalytics>('/analytics/progress');
    return response.data;
  },
};

// --- Evaluation SSE Helper ---
