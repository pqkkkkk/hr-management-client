import { useState } from "react";
import GeneralInfoCard from "../components/GeneralInfoCard";
import RuleCard from "../components/RuleCard";
import RewardListCard from "../components/RewardListCard";
import StatusCard from "../components/StatusCard";
import { mockRewardApi, restRewardApi, RestRewardApi } from "services/api/reward.api";
import { RewardProgramFormData } from "../types/rewardForm";
import { toast } from "react-toastify";

const CreateRewardProgramPage: React.FC = () => {
  const [formData, setFormData] = useState<RewardProgramFormData>({
    name: "",
    description: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    defaultGivingBudget: 0,
    bannerUrl: "",
    items: [],
    policies: []
  });

  const handleActivate = async () => {
    const payload = {
      name: formData.name || "string",
      description: formData.description || "string",
      startDate: formData.startDate,
      endDate: formData.endDate,
      defaultGivingBudget: formData.defaultGivingBudget,
      bannerUrl: formData.bannerUrl || "string",
      items: formData.items.length > 0 ? formData.items : [
        {
          name: "string",
          requiredPoints: 1,
          quantity: 2147483647,
          imageUrl: "string"
        }
      ],
      policies: formData.policies.length > 0 ? formData.policies : [
        {
          policyType: "NOT_LATE",
          unitValue: 2147483647,
          pointsPerUnit: 2147483647
        }
      ]
    };
    const response = await restRewardApi.createRewardProgram(payload);
    if (response) {
      toast.success("Đợt khen thưởng đã được tạo và kích hoạt thành công!");
    }else { 
      toast.error("Có lỗi xảy ra khi tạo đợt khen thưởng. Vui lòng thử lại.");
    }
    console.log("Payload to submit:", JSON.stringify(payload, null, 2));
  };

  const handleGeneralInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      items
    }));
  };

  const handlePoliciesChange = (policies: Array<{
    policyType: string;
    unitValue: number;
    pointsPerUnit: number;
  }>) => {
    setFormData(prev => ({
      ...prev,
      policies
    }));
  };

  const handleBudgetChange = (budget: number) => {
    setFormData(prev => ({
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
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <GeneralInfoCard 
            data={{
              name: formData.name,
              description: formData.description,
              startDate: formData.startDate,
              endDate: formData.endDate,
              bannerUrl: formData.bannerUrl
            }}
            onChange={handleGeneralInfoChange}
          />
          <RewardListCard 
            items={formData.items}
            onItemsChange={handleItemsChange}
          />
        </div>

        <div className="col-span-4 space-y-6">
          <RuleCard 
            policies={formData.policies}
            defaultGivingBudget={formData.defaultGivingBudget}
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
