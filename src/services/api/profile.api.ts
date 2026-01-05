import { ApiResponse, Page, User } from "shared/types";
import {
  buildXlsxBlob,
  buildPdfBlob,
  exportHeaders,
  departmentIdToName,
  usersToRows,
} from "shared/utils/export-utils";
import { springApiClient } from "./api.client";
import { ExportProfilesRequest, ProfileFilter, UpdateProfileRequestForEmployee, UpdateProfileRequestForHR } from "modules/profile/types/profile.req.types";
import { users } from "shared/data/profile.data";
import { ExportProfilesResponse } from "modules/profile/types/profile.resp.types";

export interface ProfileApi {
  getProfiles(filter?: ProfileFilter): Promise<ApiResponse<Page<User>>>;
  getProfileById(id: string): Promise<ApiResponse<User>>;
  updateProfileForHR(
    userId: string,
    req: UpdateProfileRequestForHR
  ): Promise<ApiResponse<User>>;
  updateProfileForEmployee(
    userId: string,
    req: UpdateProfileRequestForEmployee
  ): Promise<ApiResponse<User>>;
  deactivateUser(userId: string): Promise<ApiResponse<User>>;
  exportProfiles?(req: ExportProfilesRequest): Promise<ApiResponse<ExportProfilesResponse>>;
}

export class MockProfileApi implements ProfileApi {
  getProfiles(filter?: ProfileFilter): Promise<ApiResponse<Page<User>>> {
    return new Promise((resolve) => {
      setTimeout(() => {

        const page: Page<User> = {
          content: users,
          totalElements: users.length,
          totalPages: 1,
          size: users.length,
          number: 0,
          first: true,
          last: true,
          numberOfElements: users.length,
          empty: users.length === 0,
          pageable: {
            pageNumber: 0,
            pageSize: users.length,
            offset: 0,
            paged: true,
            unpaged: false,
            sort: {
              sorted: false,
              unsorted: true,
              empty: true
            }
          },
          sort: {
            sorted: false,
            unsorted: true,
            empty: true
          }
        };

        resolve({
          data: page,
          message: "Mock profiles fetched successfully",
          statusCode: 200,
          success: true,
        });
      }, 1000);
    });
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
            bankAccountNumber: "0123456789",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          message: "Mock profile data fetched successfully",
          statusCode: 200,
          success: true,
        });
      }, 3000);
    });
  }

  updateProfileForHR(
    userId: string,
    req: UpdateProfileRequestForHR
  ): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            ...req,
            userId,
            updatedAt: new Date().toISOString(),
          } as User,
          message: "Mock profile updated successfully",
          statusCode: 200,
          success: true,
        });
      }, 1000);
    });
  }

  updateProfileForEmployee(
    userId: string,
    req: UpdateProfileRequestForEmployee
  ): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            ...req,
            userId,
            updatedAt: new Date().toISOString(),
          } as User,
          message: "Mock profile updated successfully",
          statusCode: 200,
          success: true,
        });
      }, 1000);
    });
  }
  deactivateUser(userId: string): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: null,
          message: `Nhân viên ${userId} đã được vô hiệu hóa (mock)`,
          statusCode: 200,
          success: true,
        });
      }, 800);
    });
  }

  exportProfiles(filter?: any): Promise<ApiResponse<ExportProfilesResponse>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        (async () => {
          try {
            const allUsers: User[] = users;

            // Áp dụng bộ lọc
            const q = (filter?.search || "").toLowerCase().trim();
            const filteredUsers = allUsers.filter((u) => {
              if (q) {
                const matchesQ =
                  (u.fullName || "").toLowerCase().includes(q) ||
                  (u.userId || "").toLowerCase().includes(q) ||
                  (u.email || "").toLowerCase().includes(q);
                if (!matchesQ) return false;
              }
              if (filter?.gender && filter.gender !== "") {
                if ((u.gender || "") !== filter.gender) return false;
              }
              if (filter?.department && filter.department !== "") {
                // bộ lọc phòng ban từ UI là nhãn (ví dụ: "IT", "Kế toán")
                // do mock users lưu `departmentId` (ví dụ: DPT01)
                const departmentIdToName: Record<string, string> = {
                  DPT01: "Kế toán",
                  DPT02: "Nhân sự",
                  DPT03: "IT",
                  DPT04: "Marketing",
                };
                const deptName = u.departmentId
                  ? departmentIdToName[u.departmentId] || u.departmentId
                  : "";
                if (
                  deptName !== filter.department &&
                  u.departmentId !== filter.department
                )
                  return false;
              }
              if (filter?.position && filter.position !== "") {
                if ((u.position || "") !== filter.position) return false;
              }
              if (filter?.status && filter.status !== "") {
                if ((u.status || "") !== filter.status) return false;
              }
              return true;
            });

            const format = (filter && filter.format) === "pdf" ? "pdf" : "xlsx";
            const ts = Date.now();
            // Để tương thích với Excel và đảm bảo mỗi trường nằm trong ô riêng của nó
            // tạo tệp UTF-8 TSV (phân tách bằng tab) có BOM khi người dùng yêu cầu "xlsx".
            // Điều này giúp tránh việc thêm các phụ thuộc mới và đảm bảo chương trình bảng tính phân chia các cột một cách chính xác.
            const filename = `list-users-${ts}.${format === "pdf" ? "pdf" : "xlsx"
              }`;

            let blob: Blob;
            // sử dụng shared headers/mapping/helpers
            const headers = exportHeaders;
            const rows = usersToRows(filteredUsers);

            if (format === "xlsx") {
              blob = buildXlsxBlob(rows, headers);
            } else {
              blob = await buildPdfBlob(
                filteredUsers,
                headers,
                departmentIdToName
              );
            }

            const url = URL.createObjectURL(blob);
            resolve({
              data: { fileUrl: url },
              message: "Đã tải file " + filename,
              statusCode: 200,
              success: true,
            });
          } catch (err) {
            resolve({
              data: { fileUrl: "" },
              message: "Export thất bại (mock)",
              statusCode: 500,
              success: false,
            });
          }
        })();
      }, 1200);
    });
  }
}

export class RestProfileApi implements ProfileApi {
  updateProfileForEmployee(
    userId: string,
    req: UpdateProfileRequestForEmployee
  ): Promise<ApiResponse<User>> {
    const response = springApiClient.patch<ApiResponse<User>>(`/users/${userId}/for-employee`, req);
    return response;
  }
  updateProfileForHR(
    userId: string,
    req: UpdateProfileRequestForHR
  ): Promise<ApiResponse<User>> {
    const response = springApiClient.patch<ApiResponse<User>>(`/users/${userId}/for-hr`, req);
    return response;
  }

  async getProfiles(filter?: ProfileFilter): Promise<ApiResponse<Page<User>>> {
    const response = await springApiClient.get<ApiResponse<Page<User>>>("/users", {
      params: filter,
    });

    return response;
  }

  getProfileById(id: string): Promise<ApiResponse<User>> {
    const response = springApiClient.get<ApiResponse<User>>(`/users/${id}`);

    return response;
  }

  async deactivateUser(userId: string): Promise<ApiResponse<User>> {
    const response = await springApiClient.put<ApiResponse<User>>(`/users/${userId}/deactivate`);
    return response;
  }

  exportProfiles(req: ExportProfilesRequest): Promise<ApiResponse<ExportProfilesResponse>> {
    const response = springApiClient.post<ApiResponse<ExportProfilesResponse>>(`/users/export`, req);
    return response;
  }
}
