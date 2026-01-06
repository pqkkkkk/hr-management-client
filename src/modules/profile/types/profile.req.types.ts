import { User } from "shared/types";

export interface UpdateProfileRequestForEmployee {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
}

export namespace UpdateProfileRequestForEmployee {
    export function fromUser(user: User): UpdateProfileRequestForEmployee {
        return {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
        };
    }
}

export interface UpdateProfileRequestForHR {
    fullName?: string;
    email?: string;
    role?: string;
    status?: string;
    gender?: string;
    position?: string;
    joinDate?: string;
    identityCardNumber?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
    bankAccountNumber?: string;
    bankName?: string;
    departmentId?: string;
    departmentName?: string;
}

export namespace UpdateProfileRequestForHR {
    export function fromUser(user: User): UpdateProfileRequestForHR {
        return {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            gender: user.gender,
            position: user.position,
            joinDate: user.joinDate.toString(),
            identityCardNumber: user.identityCardNumber,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth.toString(),
            address: user.address,
            bankAccountNumber: user.bankAccountNumber,
            bankName: user.bankName,
            departmentId: user.departmentId,
            departmentName: user.departmentName,
        };
    }
}

export interface ProfileFilter {
    currentPage?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    nameTerm?: string;
    role?: string;
    gender?: string;
    status?: string;
    position?: string;
    departmentId?: string;
    departmentName?: string;
}

export type SupportedFileFormat = "PDF" | "EXCEL";

export interface ExportProfilesRequest {
    fileFormat: SupportedFileFormat;
    filter?: ProfileFilter;
}