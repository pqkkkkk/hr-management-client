import { User, UserStatus } from 'shared/types';

export interface EmployeeProfile extends User {
  // Additional profile-specific fields
  emergencyContact?: EmergencyContact;
  workHistory?: WorkHistoryEntry[];
  documents?: EmployeeDocument[];
  skills?: string[];
  certifications?: Certification[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  address?: string;
}

export interface WorkHistoryEntry {
  id: string;
  company: string;
  position: string;
  startDate: Date | string;
  endDate?: Date | string;
  description?: string;
}

export interface EmployeeDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: Date | string;
  expiryDate?: Date | string;
}

export type DocumentType = 
  | 'ID_CARD' 
  | 'CONTRACT' 
  | 'CERTIFICATE' 
  | 'RESUME' 
  | 'OTHER';

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: Date | string;
  expiryDate?: Date | string;
  certificateUrl?: string;
}

export interface UpdateEmployeeProfileDto {
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  address?: string;
  idCard?: string;
  emergencyContact?: EmergencyContact;
}

export interface UpdateEmployeeByHRDto extends UpdateEmployeeProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  position?: string;
  department?: string;
  managerId?: string;
  status?: UserStatus;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  joinDate?: Date | string;
}

export interface CreateEmployeeDto {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date | string;
  position: string;
  department: string;
  managerId?: string;
  joinDate: Date | string;
  address?: string;
  idCard?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
}

export interface DeactivateEmployeeDto {
  reason: string;
  effectiveDate?: Date | string;
  notifyEmployee: boolean;
  notifyManager: boolean;
}

export interface EmployeeFilterOptions {
  status?: UserStatus;
  department?: string;
  managerId?: string;
  searchQuery?: string;
}

export interface EmployeeExportOptions {
  format: 'EXCEL' | 'PDF';
  filters?: EmployeeFilterOptions;
  includeFields?: string[];
}

export interface ProfileChangeLog {
  id: string;
  employeeId: string;
  changedBy: string;
  changedByName: string;
  fieldName: string;
  oldValue: any;
  newValue: any;
  changeDate: Date | string;
  ipAddress?: string;
}
