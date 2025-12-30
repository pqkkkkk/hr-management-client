import { useState } from "react";
import GeneralInfoCard from "../components/GeneralInfoCard";
import RuleCard from "../components/RuleCard";
import RewardListCard from "../components/RewardListCard";
import StatusCard from "../components/StatusCard";
import { RewardProgramFormData } from "../types/rewardForm";
import { toast } from "react-toastify";
import { useApi } from "contexts/ApiContext";

const CreateRewardProgramPage: React.FC = () => {
  const { rewardApi } = useApi();
  const [request, setRequest] = useState<RewardProgramFormData>({
    name: "",
    description: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    defaultGivingBudget: 0,
    bannerUrl: "",
    items: [],
    policies: []
  });

  // Validate request before submitting
  const validateRequest = (): string | null => {
    if (!request.name || request.name.trim() === "") {
      return "Tên đợt khen thưởng không được để trống";
    }

    if (!request.startDate || !request.endDate) {
      return "Ngày bắt đầu và kết thúc không được để trống";
    }

    if (new Date(request.startDate) >= new Date(request.endDate)) {
      return "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (request.items.length === 0) {
      return "Phải có ít nhất một phần thưởng";
    }

    // Policy is optional - no validation needed

    return null;
  };

  const handleActivate = async () => {
    // Validate before submit
    const validationError = validateRequest();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const response = await rewardApi.createRewardProgram(request);
      if (response) {
        toast.success("Đợt khen thưởng đã được tạo và kích hoạt thành công!");
      } else {
        toast.error("Có lỗi xảy ra khi tạo đợt khen thưởng. Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo đợt khen thưởng. Vui lòng thử lại.");
      console.error("Error creating reward program:", error);
    }
  };

  const handleGeneralInfoChange = (field: string, value: string) => {
    setRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemsChange = (items: Array<{
    name: string;
    requiredPoints: number;
    quantity: number;
    imageUrl: string;
  }>) => {
    setRequest(prev => ({
      ...prev,
      items
    }));
  };

  const handlePoliciesChange = (policies: Array<{
    policyType: 'OVERTIME' | 'NOT_LATE' | 'FULL_ATTENDANCE';
    unitValue: number;
    pointsPerUnit: number;
  }>) => {
    setRequest(prev => ({
      ...prev,
      policies
    }));
  };

  const handleBudgetChange = (budget: number) => {
    setRequest(prev => ({
      ...prev,
      defaultGivingBudget: budget
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-sm text-gray-500 mb-2">
        Trang chủ / Quản lý khen thưởng / Tạo mới
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tạo Đợt Khen Thưởng Mới</h1>
          <p className="text-gray-500 text-sm mt-1">
            Thiết lập thông tin, quy tắc và danh mục quà tặng cho chiến dịch mới.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
            onClick={handleActivate}
          >
            🚀 Kích hoạt
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <GeneralInfoCard
            data={{
              name: request.name,
              description: request.description,
              startDate: request.startDate,
              endDate: request.endDate,
              bannerUrl: request.bannerUrl
            }}
            onChange={handleGeneralInfoChange}
          />
          <RewardListCard
            items={request.items}
            onItemsChange={handleItemsChange}
          />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <RuleCard
            policies={request.policies}
            defaultGivingBudget={request.defaultGivingBudget}
            onPoliciesChange={handlePoliciesChange}
            onBudgetChange={handleBudgetChange}
          />
          <StatusCard />
        </div>
      </div>
    </div>
  );
};

export default CreateRewardProgramPage;
