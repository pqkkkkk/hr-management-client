import { LoginRequest, LoginResponse, User, ApiResponse } from 'shared/types';
import apiClient from './api.client';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // const response = await apiClient.post<ApiResponse<LoginResponse>>(
    //   '/auth/login',
    //   credentials
    // );
    
    // if (response.data) {
    //   const { accessToken, refreshToken, user } = response.data;
    //   localStorage.setItem('accessToken', accessToken);
    //   localStorage.setItem('refreshToken', refreshToken);
    //   localStorage.setItem('user', JSON.stringify(user));
    //   return response.data;
    // }

    const mockResponse : LoginResponse = {
      user: {
        id: '1',
        employeeCode: 'E001',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken'
    };

    localStorage.setItem('accessToken', mockResponse.accessToken);
    localStorage.setItem('refreshToken', mockResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
    return mockResponse;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get current user');
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );
    
    if (response.data) {
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      return response.data;
    }
    
    throw new Error(response.error || 'Token refresh failed');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const authService = new AuthService();
export default authService;
