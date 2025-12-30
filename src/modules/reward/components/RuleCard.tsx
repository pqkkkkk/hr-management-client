import { useState } from 'react';
import {CheckboxItemProps} from '../types/checkbox.type';
import {RuleCardProps} from '../types/rewardForm';
const RuleCard: React.FC<RuleCardProps> = ({ 
  policies, 
  defaultGivingBudget,
  onPoliciesChange,
  onBudgetChange 
}) => {
  const [vndAmount, setVndAmount] = useState(100000);
  const [pointsAmount, setPointsAmount] = useState(10);

  const handleConversionChange = () => {
    // Update the first policy or create new one
    const newPolicy = {
      policyType: "NOT_LATE",
      unitValue: vndAmount,
      pointsPerUnit: pointsAmount
    };
    
    if (policies.length > 0) {
      const updatedPolicies = [...policies];
      updatedPolicies[0] = newPolicy;
      onPoliciesChange(updatedPolicies);
    } else {
      onPoliciesChange([newPolicy]);
    }
  };

  return (
    <>
      {/* Quy tắc quy đổi */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">QUY TẮC QUY ĐỔI</h2>

        <label className="text-sm font-medium">
          Tỷ lệ quy đổi (VND sang Điểm)
        </label>

        <div className="flex items-center gap-2 mt-2">
          <input 
            className="w-full border rounded-xl px-3 py-2"
            type="number"
            value={vndAmount}
            onChange={(e) => {
              setVndAmount(parseInt(e.target.value) || 0);
              handleConversionChange();
            }}
          />
          <span>→</span>
          <input 
            className="w-full border rounded-xl px-3 py-2"
            type="number"
            value={pointsAmount}
            onChange={(e) => {
              setPointsAmount(parseInt(e.target.value) || 0);
              handleConversionChange();
            }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          ⓘ {vndAmount.toLocaleString()} VND doanh số = {pointsAmount} điểm thưởng
        </p>

        <div className="mt-4">
          <label className="text-sm font-medium">
            Ngân sách tặng điểm mặc định (points/tháng)
          </label>
          <input
            className="mt-1 w-full border rounded-xl px-3 py-2"
            type="number"
            value={defaultGivingBudget}
            onChange={(e) => onBudgetChange(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Quy tắc phân bổ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">QUY TẮC PHÂN BỔ</h2>

        <div className="space-y-3">
          <CheckboxItem
            label="Cộng dồn tự động"
            description="Hệ thống tự động tính và cộng điểm vào cuối chu kỳ."
            defaultChecked
          />
          <CheckboxItem
            label="Cho phép tặng điểm"
            description="Nhân viên có thể tặng điểm thưởng cho nhau."
          />
          <CheckboxItem
            label="Thông báo email"
            description="Gửi email khi có thay đổi điểm số."
          />
        </div>
      </div>
    </>
  );
};


const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  description,
  defaultChecked = false,
}) => (
  <label className="flex gap-2 items-start">
    <input type="checkbox" defaultChecked={defaultChecked} />
    <div>
      <p className="font-medium text-sm">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </label>
);

export default RuleCard;
