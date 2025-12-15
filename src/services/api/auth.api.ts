import { SignInRequest, SignInResponse, User, ApiResponse, RefreshTokenRequest, RefreshTokenResponse } from 'shared/types';
import apiClient from './api.client';
import { mockEmployee } from 'shared/data/profile.data';

export interface AuthApi {
  signIn(req: SignInRequest): Promise<ApiResponse<SignInResponse>>;
  refreshToken(req: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>>;

}

export class RestAuthApi implements AuthApi {
  async signIn(req: SignInRequest): Promise<ApiResponse<SignInResponse>> {
    throw new Error('Method not implemented.');
  }
  async refreshToken(req: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    throw new Error('Method not implemented.');
  }

}

export class MockAuthApi implements AuthApi {
  signIn(req: SignInRequest): Promise<ApiResponse<SignInResponse>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: mockEmployee,
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            authenticated: true,
          },
          statusCode: 200,
          message: 'Mock sign-in successful',
          success: true,
        });
      }, 1000);
    });
  }
  refreshToken(req: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    throw new Error('Method not implemented.');
  }

}
