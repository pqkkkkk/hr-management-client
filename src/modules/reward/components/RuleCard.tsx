import { useState, useEffect } from 'react';
import { RuleCardProps, PolicyType } from '../types/rewardForm';

interface PolicyConfig {
  type: PolicyType;
  label: string;
  description: string;
  unitLabel: string;
  defaultUnitValue: number;
  showUnitInput: boolean;
}

const POLICY_CONFIGS: PolicyConfig[] = [
  {
    type: 'OVERTIME',
    label: 'Làm thêm giờ',
    description: 'Cộng điểm khi làm thêm giờ',
    unitLabel: 'phút',
    defaultUnitValue: 30,
    showUnitInput: true,
  },
  {
    type: 'NOT_LATE',
    label: 'Không đi trễ',
    description: 'Cộng điểm mỗi ngày không đi trễ',
    unitLabel: 'ngày',
    defaultUnitValue: 1,
    showUnitInput: false,
  },
  {
    type: 'FULL_ATTENDANCE',
    label: 'Làm đủ giờ',
    description: 'Cộng điểm mỗi ngày làm đủ giờ',
    unitLabel: 'ngày',
    defaultUnitValue: 1,
    showUnitInput: false,
  },
];

const RuleCard: React.FC<RuleCardProps> = ({
  policies,
  defaultGivingBudget,
  onPoliciesChange,
  onBudgetChange
}) => {
  // State để track policies được bật/tắt và giá trị của chúng
  const [enabledPolicies, setEnabledPolicies] = useState<Record<PolicyType, boolean>>({
    OVERTIME: false,
    NOT_LATE: false,
    FULL_ATTENDANCE: false,
  });

  const [policyValues, setPolicyValues] = useState<Record<PolicyType, { unitValue: number; pointsPerUnit: number }>>({
    OVERTIME: { unitValue: 30, pointsPerUnit: 5 },
    NOT_LATE: { unitValue: 1, pointsPerUnit: 10 },
    FULL_ATTENDANCE: { unitValue: 1, pointsPerUnit: 10 },
  });

  // Store policy IDs to preserve them during updates
  const [policyIds, setPolicyIds] = useState<Record<PolicyType, string | undefined>>({
    OVERTIME: undefined,
    NOT_LATE: undefined,
    FULL_ATTENDANCE: undefined,
  });

  // Sync with initial policies
  useEffect(() => {
    if (policies.length > 0) {
      const enabled: Record<PolicyType, boolean> = {
        OVERTIME: false,
        NOT_LATE: false,
        FULL_ATTENDANCE: false,
      };
      const values = { ...policyValues };
      const ids = { ...policyIds };

      policies.forEach(p => {
        enabled[p.policyType] = true;
        values[p.policyType] = { unitValue: p.unitValue, pointsPerUnit: p.pointsPerUnit };
        if (p.policyId) {
          ids[p.policyType] = p.policyId;
        }
      });

      setEnabledPolicies(enabled);
      setPolicyValues(values);
      setPolicyIds(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policies]); // Add policies dependency if it might change from parent, though usually it's initial.

  // Update parent when policies change
  const updatePolicies = (
    newEnabled: Record<PolicyType, boolean>,
    newValues: Record<PolicyType, { unitValue: number; pointsPerUnit: number }>
  ) => {
    const updatedPolicies = POLICY_CONFIGS
      .filter(config => newEnabled[config.type])
      .map(config => ({
        policyId: policyIds[config.type], // Preserve ID
        policyType: config.type,
        unitValue: newValues[config.type].unitValue,
        pointsPerUnit: newValues[config.type].pointsPerUnit,
      }));
    onPoliciesChange(updatedPolicies);
  };

  const handleTogglePolicy = (type: PolicyType) => {
    const newEnabled = { ...enabledPolicies, [type]: !enabledPolicies[type] };
    setEnabledPolicies(newEnabled);
    updatePolicies(newEnabled, policyValues);
  };

  const handleValueChange = (type: PolicyType, field: 'unitValue' | 'pointsPerUnit', value: number) => {
    const newValues = {
      ...policyValues,
      [type]: { ...policyValues[type], [field]: value },
    };
    setPolicyValues(newValues);
    updatePolicies(enabledPolicies, newValues);
  };

  return (
    <>
      {/* Quy tắc tích điểm */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">QUY TẮC TÍCH ĐIỂM</h2>

        <div className="space-y-4">
          {POLICY_CONFIGS.map(config => (
            <div key={config.type} className="border rounded-xl p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={enabledPolicies[config.type]}
                  onChange={() => handleTogglePolicy(config.type)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{config.label}</p>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
              </label>

              {enabledPolicies[config.type] && (
                <div className="mt-3 ml-7 flex items-center gap-2 text-sm">
                  <span>Mỗi</span>
                  {config.showUnitInput ? (
                    <input
                      type="number"
                      className="w-20 border rounded-lg px-2 py-1 text-center"
                      value={policyValues[config.type].unitValue}
                      onChange={(e) => handleValueChange(config.type, 'unitValue', parseInt(e.target.value) || 0)}
                      min={1}
                    />
                  ) : (
                    <span className="font-medium">{policyValues[config.type].unitValue}</span>
                  )}
                  <span>{config.unitLabel}</span>
                  <span>→</span>
                  <input
                    type="number"
                    className="w-20 border rounded-lg px-2 py-1 text-center"
                    value={policyValues[config.type].pointsPerUnit}
                    onChange={(e) => handleValueChange(config.type, 'pointsPerUnit', parseInt(e.target.value) || 0)}
                    min={1}
                  />
                  <span>điểm</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ngân sách tặng điểm */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">NGÂN SÁCH TẶNG ĐIỂM</h2>
        <label className="text-sm font-medium">
          Ngân sách tặng điểm cho mỗi manager
        </label>
        <input
          className="mt-2 w-full border rounded-xl px-3 py-2"
          type="number"
          value={defaultGivingBudget}
          onChange={(e) => onBudgetChange(parseInt(e.target.value) || 0)}
          min={0}
        />
        <p className="text-xs text-gray-500 mt-2">
          ⓘ Số điểm mỗi manager có thể tặng cho nhân viên trong đợt khen thưởng
        </p>
      </div>
    </>
  );
};

export default RuleCard;
