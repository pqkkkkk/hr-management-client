import { CreateLeaveRequestDTO, RejectLeaveRequestDTO, Request, RequestFilter } from "modules/request/types/request.types";
import { ApiResponse, Page } from "shared/types/common.types";
import { springApiClient } from "./api.client";


export interface LeaveRequestApi {
    getMyLeaveRequests(filter?: RequestFilter): Promise<ApiResponse<Page<Request>>>;
    getTeamLeaveRequests(filter?: RequestFilter): Promise<ApiResponse<Page<Request>>>;
    createLeaveRequest(req: CreateLeaveRequestDTO): Promise<ApiResponse<Request>>;
    rejectLeaveRequest(requestId: string, req: RejectLeaveRequestDTO): Promise<ApiResponse<Request>>;
    approveLeaveRequest(requestId: string): Promise<ApiResponse<Request>>;
}



export class RestLeaveRequestApi implements LeaveRequestApi {
    getMyLeaveRequests(filter?: RequestFilter): Promise<ApiResponse<Page<Request>>> {
        const response = springApiClient.get<ApiResponse<Page<Request>>>("/requests/leave/my-requests", {
            params: filter,
        });

        return response;
    }
    getTeamLeaveRequests(filter?: RequestFilter): Promise<ApiResponse<Page<Request>>> {
        const response = springApiClient.get<ApiResponse<Page<Request>>>("/requests/leave/team-requests", {
            params: filter,
        });

        return response;
    }
    createLeaveRequest(req: CreateLeaveRequestDTO): Promise<ApiResponse<Request>> {
        const response = springApiClient.post<ApiResponse<Request>>("/requests/leave", req);

        return response;
    }
    rejectLeaveRequest(requestId: string, req: RejectLeaveRequestDTO): Promise<ApiResponse<Request>> {
        const response = springApiClient.patch<ApiResponse<Request>>(`/requests/leave/${requestId}/reject`, req);

        return response;
    }
    approveLeaveRequest(requestId: string): Promise<ApiResponse<Request>> {
        const response = springApiClient.patch<ApiResponse<Request>>(`/requests/leave/${requestId}/approve`);

        return response;
    }

}