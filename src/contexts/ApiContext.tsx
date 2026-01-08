import React, { createContext, ReactNode, useContext } from "react";
import {
  MockProfileApi,
  ProfileApi,
  RestProfileApi,
} from "services/api/profile.api";
import {
  MockNotificationApi,
  NotificationApi,
  RestNotificationApi,
} from "services/api/notification.api";
import { ApiType } from "shared/types/common.types";
import {
  MockRequestApi,
  RequestApi,
  RestRequestApi,
} from "services/api/request.api";
import { FileApi, MockFileApi, RestFileApi } from "services/api/file.api";
import {
  MockRewardApi,
  RewardApi,
  RestRewardApi,
} from "services/api/reward.api";
import {
  ActivityApi,
  MockActivityApi,
  RestActivityApi,
} from "services/api/activity.api";
import { MockTimesheetApi, RestTimesheetApi, TimesheetApi } from "services/api/timesheet.api";

interface ApiContextType {
  profileApi: ProfileApi;
  notificationApi: NotificationApi;
  requestApi: RequestApi;
  fileApi: FileApi;
  rewardApi: RewardApi;
  activityApi: ActivityApi;
  timesheetApi: TimesheetApi;
}

interface ApiProviderProps {
  children: ReactNode;
  apiType?: ApiType; // Optional, defaults to 'mock'
}

// Factory function to create services based on API type
const createApiServices = (apiType: ApiType): ApiContextType => {
  switch (apiType) {
    case "MOCK":
      return {
        profileApi: new MockProfileApi(),
        notificationApi: new MockNotificationApi(),
        requestApi: new MockRequestApi(),
        fileApi: new MockFileApi(),
        rewardApi: new MockRewardApi(),
        activityApi: new MockActivityApi(),
        timesheetApi: new MockTimesheetApi(),
      };
    case "REST":
      return {
        profileApi: new RestProfileApi(),
        notificationApi: new RestNotificationApi(),
        requestApi: new RestRequestApi(),
        fileApi: new RestFileApi(),
        rewardApi: new RestRewardApi(),
        activityApi: new RestActivityApi(),
        timesheetApi: new RestTimesheetApi(),
      };
    default:
      throw new Error(`Unsupported API type: ${apiType}`);
  }
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<ApiProviderProps> = ({
  children,
  apiType = "MOCK", // Default to mock
}) => {
  const apiServices = createApiServices(apiType);

  return (
    <ApiContext.Provider value={apiServices}>{children}</ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);

  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }

  return context;
};

