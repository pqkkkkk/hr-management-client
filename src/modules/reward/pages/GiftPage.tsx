import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Coins, X } from "lucide-react";
import { toast } from "react-toastify";
import { UserWallet, RewardProgram } from "modules/reward/types/reward.types";
import { initials } from "shared/utils/initial-utils";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { User } from "shared/types";

type EmployeeOption = {
  id: string;
  name: string;
};

const GiftPage: React.FC = () => {
  const { rewardApi, profileApi } = useApi();
  const { user } = useAuth();
  const nf = useMemo(() => new Intl.NumberFormat("vi-VN"), []);

  // State for API data
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [activeProgram, setActiveProgram] = useState<RewardProgram | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch employees and wallet data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;

      setIsLoadingData(true);
      try {
        // Fetch employees from profile API
        const profileResponse = await profileApi.getProfiles({ pageSize: 100, currentPage: 1 });
        if (profileResponse.success && profileResponse.data?.content) {
          const employeeList = profileResponse.data.content
            .filter((u: User) => u.userId !== user.userId) // Exclude current user
            .map((u: User) => ({
              id: u.userId,
              name: u.fullName,
            }));
          setEmployees(employeeList);
        }

        // Fetch active program
        const programResponse = await rewardApi.getActiveRewardProgram();
        if (programResponse.success && programResponse.data) {
          setActiveProgram(programResponse.data);

          // Fetch wallet with giving budget
          const walletResponse = await rewardApi.getWallet(
            user.userId,
            programResponse.data.rewardProgramId
          );
          if (walletResponse.success) {
            setWallet(walletResponse.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [profileApi, rewardApi, user?.userId]);

  // Available points is now giving budget from wallet
  const availablePoints = wallet?.givingBudget || 0;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [pointsTouched, setPointsTouched] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const pointsValue = useMemo(() => {
    const n = Number(points);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.floor(n));
  }, [points]);

  const pointsError = useMemo(() => {
    if (points.trim().length === 0) return "Vui lòng nhập số điểm";
    if (pointsValue <= 0) return "Số điểm phải lớn hơn 0";
    if (pointsValue > availablePoints) return "Ngân sách không đủ";
    return null;
  }, [availablePoints, points, pointsValue]);

  const selectedEmployees = useMemo(
    () => employees.filter((e) => selectedIds.includes(e.id)),
    [employees, selectedIds]
  );

  const canAddEmployees = useMemo(
    () => employees.some((e) => !selectedIds.includes(e.id)),
    [employees, selectedIds]
  );

  const addEmployee = (id: string) => {
    if (!id) return;
    if (selectedIds.includes(id)) return;
    setSelectedIds((prev) => [...prev, id]);
  };

  const removeEmployee = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const addQuickPoints = (delta: number) => {
    setPointsTouched(true);
    setPoints((prev) => {
      const current = Number(prev);
      const base = Number.isFinite(current) ? current : 0;
      return String(Math.max(0, Math.floor(base + delta)));
    });
  };

  const onCancel = () => {
    setSelectedIds([]);
    setSelectValue("");
    setPoints("");
    setPointsTouched(false);
    setReason("");
  };

  const onGift = async () => {
    if (isSubmitting) return;

    if (selectedIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 nhân viên");
      return;
    }

    if (!activeProgram) {
      toast.error("Không tìm thấy chương trình khen thưởng đang hoạt động");
      return;
    }

    setPointsTouched(true);
    if (pointsError) return;

    try {
      setIsSubmitting(true);

      // Build recipients array with same points for each selected employee
      const recipients = selectedIds.map(userId => ({
        userId,
        points: pointsValue,
      }));

      const res = await rewardApi.giftPoints({
        programId: activeProgram.rewardProgramId,
        recipients,
        senderUserId: user?.userId || "",
      });

      if (!res.success) {
        toast.error(res.message || "Tặng điểm thất bại");
        return;
      }

      toast.success("Tặng điểm thành công!");

      // Refresh wallet to update available budget
      if (user?.userId && activeProgram) {
        const walletResponse = await rewardApi.getWallet(
          user.userId,
          activeProgram.rewardProgramId
        );
        if (walletResponse.success) {
          setWallet(walletResponse.data);
        }
      }

      onCancel();
    } catch (err: any) {
      toast.error(err?.message || "Tặng điểm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-6">
          <div className="text-xl font-bold text-gray-900">
            Tặng Điểm cho Nhân viên
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Gửi lời cảm ơn và phần thưởng đến đồng nghiệp.
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Select employees */}
          <div>
            <div className="text-sm font-semibold text-gray-800 mb-2">
              Chọn nhân viên
            </div>

            <div className="relative">
              <select
                value={selectValue}
                onChange={(e) => {
                  const id = e.target.value;
                  addEmployee(id);
                  setSelectValue("");
                }}
                disabled={!canAddEmployees || employees.length === 0}
                className="w-full h-11 px-4 pr-10 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn nhân viên</option>
                {employees.filter((e) => !selectedIds.includes(e.id)).map(
                  (e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  )
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="mt-3 border border-dashed border-gray-200 rounded-lg p-3 flex flex-wrap gap-2 min-h-[52px]">
              {selectedEmployees.length === 0 ? (
                <div className="text-sm text-gray-400">Chưa chọn nhân viên</div>
              ) : (
                selectedEmployees.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                      {initials(e.name)}
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {e.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEmployee(e.id)}
                      className="w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-700"
                      aria-label={`Bỏ chọn ${e.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Points */}
          <div>
            <div className="text-sm font-semibold text-gray-800 mb-2">
              Số điểm thưởng ({nf.format(availablePoints)} điểm ngân sách)
            </div>

            <div className="relative">
              <input
                inputMode="numeric"
                value={points}
                onChange={(e) => {
                  setPointsTouched(true);
                  const v = e.target.value;
                  if (v === "") return setPoints("");
                  if (/^\d+$/.test(v)) setPoints(v);
                }}
                onBlur={() => setPointsTouched(true)}
                placeholder="VD: 100"
                className={`w-full h-12 px-4 pr-16 border rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 ${pointsTouched && pointsError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
                  }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-gray-500">
                <Coins className="w-4 h-4" />
                Điểm
              </div>
            </div>

            {pointsTouched && pointsError && (
              <div className="mt-2 text-sm text-red-500">{pointsError}</div>
            )}

            <div className="mt-3 flex gap-3">
              {[50, 100, 200, 500].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => addQuickPoints(v)}
                  className="h-9 flex-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200"
                >
                  + {v}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="text-sm font-semibold text-gray-800 mb-2">
              Lý do tặng điểm
            </div>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 200))}
                placeholder="Nhập lý do khen thưởng..."
                className="w-full min-h-[110px] px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="absolute right-3 bottom-2 text-xs text-gray-400">
                {reason.length}/200
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 px-6 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onGift}
            disabled={isSubmitting}
            className="h-11 px-6 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang xử lý..." : "Tặng Điểm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftPage;
