import { ApiResponse, User } from "shared/types";


export interface ProfileApi {
    getProfiles(): Promise<ApiResponse<User[]>>;
    getProfileById(id: string): Promise<ApiResponse<User>>;
}

export class MockProfileApi implements ProfileApi {
    getProfiles(): Promise<ApiResponse<User[]>> {
        // TODO: Implement mock logic here
        throw new Error("Method not implemented.");
    }
    getProfileById(id: string): Promise<ApiResponse<User>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        userId: "NV001",
                        fullName: "Nguyễn Văn A",
                        email: "nva@gmail.com",
                        role: "EMPLOYEE",
                        status: "ACTIVE",
                        position: "Nhân viên",
                        joinDate: "12/11/2024",
                        identityCardNumber: "293492390420",
                        dateOfBirth: "08/05/2004",
                        gender: "Nam",
                        phoneNumber: "0123456789",
                        address: "TP.HCM",
                        bankName: "Vietcombank",
                        bankAccount: "0123456789",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    message: "Mock profile data fetched successfully",
                    statusCode: 200,
                    success: true,
                })
            }, 3000);
        });
    }
}

export class RestProfileApi implements ProfileApi {
    getProfiles(): Promise<ApiResponse<User[]>> {
        throw new Error("Method not implemented.");
    }
    getProfileById(id: string): Promise<ApiResponse<User>> {
        throw new Error("Method not implemented.");
    }
}