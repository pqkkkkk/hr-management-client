import { TimesheetDailyEntry, TimesheetResponse } from "modules/request/types/request.types";
import { springApiClient } from "./api.client";
import { ApiResponse } from "shared/types";

export interface TimesheetApi {
    getTimesheetByEmployeeIdAndDate(employeeId: string, date: string): Promise<ApiResponse<TimesheetDailyEntry>>
}

export class RestTimesheetApi implements TimesheetApi {
    async getTimesheetByEmployeeIdAndDate(employeeId: string, date: string): Promise<ApiResponse<TimesheetDailyEntry>> {
        return await springApiClient.get<ApiResponse<TimesheetDailyEntry>>(`/timesheets/employee/${employeeId}/date/${date}`);
    }

}

export class MockTimesheetApi implements TimesheetApi {
    async getTimesheetByEmployeeIdAndDate(employeeId: string, date: string): Promise<ApiResponse<TimesheetDailyEntry>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: null,
                    success: true,
                    statusCode: 200,
                    message: "Timesheet retrieved successfully",
                });
            }, 500);
        });
    }

}