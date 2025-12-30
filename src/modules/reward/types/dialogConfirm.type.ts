import { RewardItem } from "./reward.types";

export interface DialogConfirmProps {
  open: boolean;
  onClose: () => void;
  reward: RewardItem | null;        // Thông tin phần thưởng được chọn
  currentBalance: number;           // Số dư điểm hiện tại
  maxQuantity: number;              // Số lượng tối đa có thể đổi (stock)
  onSubmit: (quantity: number) => Promise<void>;  // Callback xử lý đổi quà
  isSubmitting?: boolean;           // Loading state
}