import { SignInRequest, SignInResponse, User, ApiResponse, RefreshTokenRequest, RefreshTokenResponse } from 'shared/types';
import apiClient from './api.client';

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
    throw new Error('Method not implemented.');
  }
  refreshToken(req: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    throw new Error('Method not implemented.');
  }

}
