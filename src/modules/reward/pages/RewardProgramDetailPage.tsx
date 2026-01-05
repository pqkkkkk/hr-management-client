import { useEffect, useState, useMemo, useCallback } from "react";
import RewardProgramHeader from "../components/RewardProgramHeader";
import InfoCard from "../components/InfoCard";
import RewardList from "../components/RewardList";
import RedeemConfirmDialog from "../components/Dialog";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { RewardProgramDetail, UserWallet, RewardPolicy, RewardItem } from "../types/reward.types";
import { toast } from "react-toastify";

export default function RewardProgramDetailPage() {
  const { rewardApi } = useApi();
  const { user } = useAuth();

  const [program, setProgram] = useState<RewardProgramDetail | null>(null);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog state
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWallet = useCallback(async (userId: string, programId: string) => {
    try {
      const walletResponse = await rewardApi.getWallet(userId, programId);
      if (walletResponse.success) {
        setWallet(walletResponse.data);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  }, [rewardApi]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;

      setIsLoading(true);
      try {
        // Fetch program details
        const programResponse = await rewardApi.getActiveRewardProgram();
        if (programResponse.success) {
          setProgram(programResponse.data);

          // Fetch user wallet for this program
          await fetchWallet(user.userId, programResponse.data.rewardProgramId);
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rewardApi, user?.userId, fetchWallet]);

  // Format end date
  const endDateFormatted = useMemo(() => {
    if (!program?.endDate) return "";
    const date = new Date(program.endDate);
    return date.toLocaleDateString("vi-VN");
  }, [program?.endDate]);

  // Build policy descriptions with correct meanings
  const policyDescriptions = useMemo(() => {
    if (!program?.policies) return [];
    return program.policies.map((policy: RewardPolicy) => {
      switch (policy.policyType) {
        case 'OVERTIME':
          return `Làm thêm giờ: Mỗi ${policy.unitValue} phút → +${policy.pointsPerUnit} điểm`;
        case 'NOT_LATE':
          return `Không đi trễ: Mỗi ${policy.unitValue} ngày không đi trễ → +${policy.pointsPerUnit} điểm`;
        case 'FULL_ATTENDANCE':
          return `Làm đủ giờ: Mỗi ${policy.unitValue} ngày làm đủ giờ → +${policy.pointsPerUnit} điểm`;
        default:
          return `${policy.policyType}: +${policy.pointsPerUnit} điểm`;
      }
    });
  }, [program?.policies]);

  // Handle opening the redeem dialog
  const handleRedeem = useCallback((item: RewardItem) => {
    setSelectedReward(item);
    setIsDialogOpen(true);
  }, []);

  // Handle closing the dialog
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedReward(null);
  }, []);

  // Handle exchange submission
  const handleExchange = useCallback(async (quantity: number) => {
    if (!selectedReward || !user?.userId || !program) return;

    setIsSubmitting(true);
    try {
      const response = await rewardApi.exchangeReward({
        items: [{ rewardItemId: selectedReward.rewardItemId, quantity }],
        programId: program.rewardProgramId,
        userWalletId: wallet?.userWalletId,
      });

      if (response.success) {
        // Refresh wallet to get updated balance
        await fetchWallet(user.userId, program.rewardProgramId);

        // Update the item quantity in program state
        setProgram(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map(item =>
              item.rewardItemId === selectedReward.rewardItemId
                ? { ...item, quantity: item.quantity - quantity }
                : item
            ),
          };
        });

        handleCloseDialog();
        // Optionally show success message
        toast.info("Đổi quà thành công!");
      } else {
        toast.error("Đổi quà thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error exchanging reward:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedReward, user?.userId, program, rewardApi, fetchWallet, handleCloseDialog]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Không có chương trình khen thưởng nào</div>
      </div>
    );
  }

  const currentBalance = wallet?.personalPoint || 0;

  return (
    <div className="space-y-8 p-6">
      <RewardProgramHeader
        program={program}
        userPoints={currentBalance}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-1">
          <InfoCard title="⏰ Thời hạn điểm" danger>
            <p className="text-sm text-gray-600">
              Điểm thưởng sẽ hết hạn vào:
            </p>
            <p className="mt-2 font-semibold">{endDateFormatted}</p>
          </InfoCard>

          <InfoCard title="⭐ Cách tích điểm">
            <ul className="space-y-2 text-sm text-gray-600">
              {policyDescriptions.length > 0 ? (
                policyDescriptions.map((desc, idx) => (
                  <li key={idx}>✔ {desc}</li>
                ))
              ) : (
                <li>Chưa có quy tắc tích điểm</li>
              )}
            </ul>
          </InfoCard>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">🎁 Danh mục quà tặng</h2>

            <div className="flex gap-2">
              <select className="rounded-lg border px-3 py-2 text-sm">
                <option>Tất cả quà tặng</option>
              </select>

              <select className="rounded-lg border px-3 py-2 text-sm">
                <option>Điểm: Thấp → Cao</option>
              </select>
            </div>
          </div>

          <RewardList
            items={program.items || []}
            currentBalance={currentBalance}
            onRedeem={handleRedeem}
          />
        </div>
      </div>

      {/* Redeem Dialog */}
      <RedeemConfirmDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        reward={selectedReward}
        currentBalance={currentBalance}
        maxQuantity={selectedReward?.quantity || 0}
        onSubmit={handleExchange}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
