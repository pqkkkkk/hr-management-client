export type PolicyType = 'OVERTIME' | 'NOT_LATE' | 'FULL_ATTENDANCE';

export interface RewardProgramFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  defaultGivingBudget: number;
  bannerUrl: string;
  items: Array<{
    rewardItemId?: string;
    name: string;
    requiredPoints: number;
    quantity: number;
    imageUrl: string;
  }>;
  policies: Array<{
    policyId?: string;
    policyType: PolicyType;
    unitValue: number;
    pointsPerUnit: number;
  }>;
}

export interface GeneralInfoCardProps {
  data: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    bannerUrl: string;
  };
  onChange: (field: string, value: string) => void;
}

export interface RewardListCardProps {
  items: Array<{
    rewardItemId?: string;
    name: string;
    requiredPoints: number;
    quantity: number;
    imageUrl: string;
  }>;
  onItemsChange: (items: Array<{
    rewardItemId?: string;
    name: string;
    requiredPoints: number;
    quantity: number;
    imageUrl: string;
  }>) => void;
}

export interface RuleCardProps {
  policies: Array<{
    policyId?: string;
    policyType: PolicyType;
    unitValue: number;
    pointsPerUnit: number;
  }>;
  defaultGivingBudget: number;
  onPoliciesChange: (policies: Array<{
    policyId?: string;
    policyType: PolicyType;
    unitValue: number;
    pointsPerUnit: number;
  }>) => void;
  onBudgetChange: (budget: number) => void;
}

export interface RewardProgramResponse {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  defaultGivingBudget: number;
  bannerUrl: string;
  items: Array<{
    name: string;
    requiredPoints: number;
    quantity: number;
    imageUrl: string;
  }>;
  policies: Array<{
    policyType: PolicyType;
    unitValue: number;
    pointsPerUnit: number;
  }>;
  success: boolean;

}
