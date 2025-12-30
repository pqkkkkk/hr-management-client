import { ApiResponse } from "shared/types";
import { springApiClient } from "./api.client";

export interface FileApi {
    uploadFile(file: File): Promise<ApiResponse<string>>;
}

export class RestFileApi implements FileApi {
    async uploadFile(file: File): Promise<ApiResponse<string>> {
        const formData = new FormData();
        formData.append("file", file);

        return springApiClient.post<ApiResponse<string>>("/files", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
}

export class MockFileApi implements FileApi {
    async uploadFile(file: File): Promise<ApiResponse<string>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate a mock URL for the uploaded file
                const mockUrl = `https://example.com/uploads/${Date.now()}_${file.name}`;
                resolve({
                    data: mockUrl,
                    success: true,
                    statusCode: 200,
                    message: "File uploaded successfully",
                });
            }, 500);
        });
    }
}
