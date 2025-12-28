import { use, useCallback, useMemo } from "react";
import RewardCard from "./RewardCard";
import {restRewardApi} from "../../../services/api/reward.api";
import { useFetchList } from "shared/hooks/use-fetch-list";
import { RewardItem,RewardItemFilter  } from "../types/reward.types";
import { useFetchDetail } from "../hooks/useFetchDetail";
export default function RewardList() {
  const fetchProgram = useCallback(
    () => restRewardApi.getRewardProgramById("program-003"),
    []
  );

  const queryParams = useMemo<RewardItemFilter>(
    () => ({ status: 'ACTIVE', currentPage: 1, pageSize: 10, sortBy: 'createdAt', sortDirection: 'DESC' }),
    []
  );

  const { data: rewardProgram, isFetching } =
  useFetchDetail<any>(fetchProgram);


  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rewardProgram?.items?.map((program) => (
        <RewardCard
          key={program.rewardItemId}
          image={program.bannerUrl}
          title={program.name}
          description={program.description}
          point={program.requiredPoints}
          disabled={false}
        />
      )) || <div>No rewards available</div>}
    </div>
  );
}
