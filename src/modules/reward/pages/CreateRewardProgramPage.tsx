import GeneralInfoCard from "../components/GeneralInfoCard";
import RuleCard from "../components/RuleCard";
import RewardListCard from "../components/RewardListCard";
import StatusCard from "../components/StatusCard";

const CreateRewardProgramPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
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
          <button className="px-4 py-2 border rounded-xl bg-white hover:bg-gray-100">
            💾 Lưu nháp
          </button>
          <button className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600">
            🚀 Kích hoạt
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <GeneralInfoCard />
          <RewardListCard />
        </div>

        <div className="col-span-4 space-y-6">
          <RuleCard />
          <StatusCard />
        </div>
      </div>
    </div>
  );
};

export default CreateRewardProgramPage;
