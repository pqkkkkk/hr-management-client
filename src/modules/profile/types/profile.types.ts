export interface EmployeeFormErrors {
  [key: string]: string;
}

export const positionOptions = [
  { value: "Nhân viên", label: "Nhân viên" },
  { value: "Trưởng phòng", label: "Trưởng phòng" },
  { value: "Giám đốc", label: "Giám đốc" },
];

export const departmentOptions = [
  { value: "Kế toán", label: "Kế toán" },
  { value: "Nhân sự", label: "Nhân sự" },
  { value: "IT", label: "IT" },
  { value: "Marketing", label: "Marketing" },
];

export const genderOptions = [
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
  { value: "Khác", label: "Khác" },
];

export const bankOptions = [
  { value: "Vietcombank", label: "Vietcombank" },
  { value: "VietinBank", label: "VietinBank" },
  { value: "BIDV", label: "BIDV" },
  { value: "Techcombank", label: "Techcombank" },
  { value: "ACB", label: "ACB" },
];

export const statusOptions = [
  { value: "ACTIVE", label: "Đang làm việc" },
  { value: "ON_LEAVE", label: "Đang nghỉ phép" },
  { value: "INACTIVE", label: "Đã nghỉ việc" },
];
