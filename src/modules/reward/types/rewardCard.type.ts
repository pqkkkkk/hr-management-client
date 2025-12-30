import { RewardItem } from "./reward.types";

export type InfoCardProps = {
  item: RewardItem;                           // Truyền cả object thay vì từng prop
  currentBalance: number;                     // Số dư user
  onRedeem: (item: RewardItem) => void;       // Callback mở dialog
};