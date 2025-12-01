export interface EmployeeFormErrors {
  [key: string]: string;
}

export const positionOptions = [
  { value: "PROJECT_MANAGER", label: "PROJECT_MANAGER" },
  { value: "HR_SPECIALIST", label: "HR_SPECIALIST" },
  { value: "MARKETING_MANAGER", label: "MARKETING_MANAGER" },
  { value: "FINANCE_ANALYST", label: "FINANCE_ANALYST" },
  { value: "JUNIOR_DEVELOPER", label: "JUNIOR_DEVELOPER" },
  { value: "INTERN", label: "INTERN" },
  { value: "SENIOR_DEVELOPER", label: "SENIOR_DEVELOPER" },
  { value: "SALES_REPRESENTATIVE", label: "SALES_REPRESENTATIVE" },
];

export const departmentOptions = [
  { value: "Engineering", label: "Engineering" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Marketing", label: "Marketing" },
  { value: "Finance", label: "Finance" },
  { value: "Sales", label: "Sales" },
];

export const genderOptions = [
  { value: "Nam", label: "Nam" },
  { value: "Nữ", label: "Nữ" },
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
