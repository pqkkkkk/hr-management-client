import { ApiResponse, User } from "shared/types";


export interface ProfileApi {
    getProfiles(): Promise<ApiResponse<User[]>>;
}

export class MockProfileApi implements ProfileApi {
    getProfiles(): Promise<ApiResponse<User[]>> {
        // TODO: Implement mock logic here
        throw new Error("Method not implemented.");
    }
}

export class RestProfileApi implements ProfileApi {
    getProfiles(): Promise<ApiResponse<User[]>> {
        throw new Error("Method not implemented.");
    }
}