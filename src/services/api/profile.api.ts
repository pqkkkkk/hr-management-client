import { ApiResponse, User } from "shared/types";
import {
  buildXlsxBlob,
  buildPdfBlob,
  exportHeaders,
  departmentIdToName,
  usersToRows,
} from "shared/utils/export-utils";
import apiClient from "./api.client";

export interface ProfileApi {
  getProfiles(): Promise<ApiResponse<User[]>>;
  getProfileById(id: string): Promise<ApiResponse<User>>;
  updateProfileForHR(userId: string, profileData: Partial<User>): Promise<ApiResponse<User>>;
  updateProfileForEmployee(userId: string, profileData: Partial<User>): Promise<ApiResponse<User>>;
  deactivateUser(userId: string): Promise<ApiResponse<null>>;
  exportUsers?(filter?: any): Promise<ApiResponse<string>>;
}

export class MockProfileApi implements ProfileApi {
  getProfiles(): Promise<ApiResponse<User[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const users: User[] = [
          {
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
            departmentId: "DPT03",
          },
          {
            userId: "NV002",
            fullName: "Trần Thị B",
            email: "ttb@gmail.com",
            role: "MANAGER",
            status: "ACTIVE",
            position: "Trưởng phòng",
            joinDate: "01/02/2022",
            identityCardNumber: "293492390420",
            dateOfBirth: "15/07/1990",
            gender: "Nữ",
            phoneNumber: "0987654321",
            address: "Hà Nội",
            bankName: "BIDV",
            bankAccount: "0987654321",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT01",
          },
          {
            userId: "NV003",
            fullName: "Lê Văn C",
            email: "lvc@gmail.com",
            role: "HR",
            status: "ACTIVE",
            position: "Giám đốc",
            joinDate: "10/06/2020",
            identityCardNumber: "293492390420",
            dateOfBirth: "20/03/1992",
            gender: "Nam",
            phoneNumber: "0911222333",
            address: "Đà Nẵng",
            bankName: "Techcombank",
            bankAccount: "1122334455",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT02",
          },
          {
            userId: "NV004",
            fullName: "Phạm Thị D",
            email: "ptd@gmail.com",
            role: "EMPLOYEE",
            status: "ON_LEAVE",
            position: "Nhân viên",
            joinDate: "05/09/2023",
            identityCardNumber: "293492390420",
            dateOfBirth: "02/12/1995",
            gender: "Nữ",
            phoneNumber: "0900111222",
            address: "Cần Thơ",
            bankName: "Sacombank",
            bankAccount: "2233445566",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT04",
          },
          {
            userId: "NV005",
            fullName: "Hoàng Văn E",
            email: "hve@gmail.com",
            role: "ADMIN",
            status: "INACTIVE",
            position: "Nhân viên",
            joinDate: "20/01/2019",
            identityCardNumber: "293492390420",
            dateOfBirth: "30/11/1985",
            gender: "Nam",
            phoneNumber: "0933444555",
            address: "Hải Phòng",
            bankName: "VPBank",
            bankAccount: "3344556677",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT03",
          },
          {
            userId: "NV006",
            fullName: "Nguyễn Văn G",
            email: "nvg@gmail.com",
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
            departmentId: "DPT02",
          },
          {
            userId: "NV007",
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
            departmentId: "DPT03",
          },
          {
            userId: "NV008",
            fullName: "Trần Thị B",
            email: "ttb@gmail.com",
            role: "MANAGER",
            status: "ACTIVE",
            position: "Trưởng phòng",
            joinDate: "01/02/2022",
            identityCardNumber: "293492390420",
            dateOfBirth: "15/07/1990",
            gender: "Nữ",
            phoneNumber: "0987654321",
            address: "Hà Nội",
            bankName: "BIDV",
            bankAccount: "0987654321",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT01",
          },
          {
            userId: "NV009",
            fullName: "Lê Văn C",
            email: "lvc@gmail.com",
            role: "HR",
            status: "ACTIVE",
            position: "Giám đốc",
            joinDate: "10/06/2020",
            identityCardNumber: "293492390420",
            dateOfBirth: "20/03/1992",
            gender: "Nam",
            phoneNumber: "0911222333",
            address: "Đà Nẵng",
            bankName: "Techcombank",
            bankAccount: "1122334455",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT02",
          },
          {
            userId: "NV0010",
            fullName: "Phạm Thị D",
            email: "ptd@gmail.com",
            role: "EMPLOYEE",
            status: "ON_LEAVE",
            position: "Nhân viên",
            joinDate: "05/09/2023",
            identityCardNumber: "293492390420",
            dateOfBirth: "02/12/1995",
            gender: "Nữ",
            phoneNumber: "0900111222",
            address: "Cần Thơ",
            bankName: "Sacombank",
            bankAccount: "2233445566",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT04",
          },
          {
            userId: "NV0011",
            fullName: "Hoàng Văn E",
            email: "hve@gmail.com",
            role: "ADMIN",
            status: "INACTIVE",
            position: "Truởng phòng",
            joinDate: "20/01/2019",
            identityCardNumber: "293492390420",
            dateOfBirth: "30/11/1985",
            gender: "Nam",
            phoneNumber: "0933444555",
            address: "Hải Phòng",
            bankName: "VPBank",
            bankAccount: "3344556677",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT03",
          },
          {
            userId: "NV0012",
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
            departmentId: "DPT03",
          },
          {
            userId: "NV0013",
            fullName: "Trần Thị B",
            email: "ttb@gmail.com",
            role: "MANAGER",
            status: "ACTIVE",
            position: "Trưởng phòng",
            joinDate: "01/02/2022",
            identityCardNumber: "293492390420",
            dateOfBirth: "15/07/1990",
            gender: "Nữ",
            phoneNumber: "0987654321",
            address: "Hà Nội",
            bankName: "BIDV",
            bankAccount: "0987654321",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT01",
          },
          {
            userId: "NV0014",
            fullName: "Lê Văn C",
            email: "lvc@gmail.com",
            role: "HR",
            status: "ACTIVE",
            position: "Giám đốc",
            joinDate: "10/06/2020",
            identityCardNumber: "293492390420",
            dateOfBirth: "20/03/1992",
            gender: "Nam",
            phoneNumber: "0911222333",
            address: "Đà Nẵng",
            bankName: "Techcombank",
            bankAccount: "1122334455",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT02",
          },
          {
            userId: "NV0015",
            fullName: "Phạm Thị D",
            email: "ptd@gmail.com",
            role: "EMPLOYEE",
            status: "ON_LEAVE",
            position: "Nhân viên",
            joinDate: "05/09/2023",
            identityCardNumber: "293492390420",
            dateOfBirth: "02/12/1995",
            gender: "Nữ",
            phoneNumber: "0900111222",
            address: "Cần Thơ",
            bankName: "Sacombank",
            bankAccount: "2233445566",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT04",
          },
          {
            userId: "NV0016",
            fullName: "Hoàng Văn E",
            email: "hve@gmail.com",
            role: "ADMIN",
            status: "INACTIVE",
            position: "Trưởng phòng",
            joinDate: "20/01/2019",
            identityCardNumber: "293492390420",
            dateOfBirth: "30/11/1985",
            gender: "Nam",
            phoneNumber: "0933444555",
            address: "Hải Phòng",
            bankName: "VPBank",
            bankAccount: "3344556677",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT03",
          },
          {
            userId: "NV0017",
            fullName: "Hoàng Văn E",
            email: "hve@gmail.com",
            role: "ADMIN",
            status: "INACTIVE",
            position: "Trưởng phòng",
            joinDate: "20/01/2019",
            identityCardNumber: "293492390420",
            dateOfBirth: "30/11/1985",
            gender: "Nam",
            phoneNumber: "0933444555",
            address: "Hải Phòng",
            bankName: "VPBank",
            bankAccount: "3344556677",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT03",
          },
          {
            userId: "NV0018",
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
            departmentId: "DPT03",
          },
          {
            userId: "NV0019",
            fullName: "Trần Thị B",
            email: "ttb@gmail.com",
            role: "MANAGER",
            status: "ACTIVE",
            position: "Trưởng phòng",
            joinDate: "01/02/2022",
            identityCardNumber: "293492390420",
            dateOfBirth: "15/07/1990",
            gender: "Nữ",
            phoneNumber: "0987654321",
            address: "Hà Nội",
            bankName: "BIDV",
            bankAccount: "0987654321",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT01",
          },
          {
            userId: "NV0020",
            fullName: "Lê Văn C",
            email: "lvc@gmail.com",
            role: "HR",
            status: "ACTIVE",
            position: "Giám đốc",
            joinDate: "10/06/2020",
            identityCardNumber: "293492390420",
            dateOfBirth: "20/03/1992",
            gender: "Nam",
            phoneNumber: "0911222333",
            address: "Đà Nẵng",
            bankName: "Techcombank",
            bankAccount: "1122334455",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT02",
          },
          {
            userId: "NV0021",
            fullName: "Phạm Thị D",
            email: "ptd@gmail.com",
            role: "EMPLOYEE",
            status: "ON_LEAVE",
            position: "Nhân viên",
            joinDate: "05/09/2023",
            identityCardNumber: "293492390420",
            dateOfBirth: "02/12/1995",
            gender: "Nữ",
            phoneNumber: "0900111222",
            address: "Cần Thơ",
            bankName: "Sacombank",
            bankAccount: "2233445566",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT04",
          },
          {
            userId: "NV0022",
            fullName: "Hoàng Văn E",
            email: "hve@gmail.com",
            role: "ADMIN",
            status: "INACTIVE",
            position: "Trưởng phòng",
            joinDate: "20/01/2019",
            identityCardNumber: "293492390420",
            dateOfBirth: "30/11/1985",
            gender: "Nam",
            phoneNumber: "0933444555",
            address: "Hải Phòng",
            bankName: "VPBank",
            bankAccount: "3344556677",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            departmentId: "DPT03",
          },
        ];

        resolve({
          data: users,
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
            bankAccount: "0123456789",
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
    profileData: Partial<User>
  ): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            ...profileData,
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

  updateProfileForEmployee(userId: string, profileData: Partial<User>): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            ...profileData,
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
  deactivateUser(userId: string): Promise<ApiResponse<null>> {
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

  exportUsers(filter?: any): Promise<ApiResponse<string>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        (async () => {
          try {
            // Lấy danh sách nhân viên hiện có từ mock API
            const resp = await this.getProfiles();
            const allUsers: User[] = resp?.data || [];

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
            const filename = `list-users-${ts}.${
              format === "pdf" ? "pdf" : "xlsx"
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
              data: url,
              message: "Đã tải file " + filename,
              statusCode: 200,
              success: true,
            });
          } catch (err) {
            resolve({
              data: "",
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
  updateProfileForEmployee(userId: string, profileData: Partial<User>): Promise<ApiResponse<User>> {
    throw new Error("Method not implemented.");
  }
  updateProfileForHR(
    userId: string,
    profileData: Partial<User>
  ): Promise<ApiResponse<User>> {
    throw new Error("Method not implemented.");
  }

  async getProfiles(): Promise<ApiResponse<User[]>> {
    try {
      // Gọi GET /api/v1/users
      const raw = await apiClient.get<any>("/users");

      const list: any[] = raw?.data?.content ?? [];

      const users: User[] = list.map(
        (u: any): User => ({
          userId: u.userId,
          fullName: u.fullName,
          email: u.email,
          role: u.role,
          status: u.status,
          position: u.position,
          joinDate: u.joinDate,
          identityCardNumber: u.identityCardNumber,
          dateOfBirth: u.dateOfBirth,
          gender: u.gender,
          phoneNumber: u.phoneNumber,
          address: u.address,
          bankName: u.bankName,
          bankAccount: u.bankAccountNumber,
          departmentId: u.departmentId,
          departmentName: u.departmentName,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        })
      );

      return {
        data: users,
        statusCode: 200,
        message: "OK",
        success: true,
      };
    } catch (error: any) {
      const status = error?.response?.status ?? 500;

      return {
        data: [],
        statusCode: status,
        message: "Không thể tải danh sách nhân viên",
        success: false,
      };
    }
  }

  getProfileById(id: string): Promise<ApiResponse<User>> {
    throw new Error("Method not implemented.");
  }
  async deactivateUser(userId: string): Promise<ApiResponse<null>> {
    try {
      const resp = await apiClient.put<any>(`/users/${userId}/deactivate`);

      if (resp && typeof resp === "object" && "success" in resp) {
        return resp as ApiResponse<null>;
      }

      return {
        data: null,
        success: true,
        statusCode: 200,
        message: (resp && resp.message) || "User deactivated",
      };
    } catch (err: any) {
      const status = err?.response?.status || 500;
      const message =
        err?.response?.data?.message || err?.message || "Deactivate failed";
      return {
        data: null,
        success: false,
        statusCode: status,
        message,
      };
    }
  }
  exportUsers(filter?: any): Promise<ApiResponse<string>> {
    throw new Error("Method not implemented.");
  }
}
