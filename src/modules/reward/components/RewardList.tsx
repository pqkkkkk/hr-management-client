import RewardCard from "./RewardCard";
import { RewardItem } from "../types/reward.types";

interface RewardListProps {
  items: RewardItem[];
  currentBalance: number;
  onRedeem: (item: RewardItem) => void;
}

export default function RewardList({ items, currentBalance, onRedeem }: RewardListProps) {
  if (items.length === 0) {
    return <div className="text-gray-500">Chưa có phần thưởng trong chương trình này</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <RewardCard
          key={item.rewardItemId}
          item={item}
          currentBalance={currentBalance}
          onRedeem={onRedeem}
        />
      ))}
    </div>
  );
}
