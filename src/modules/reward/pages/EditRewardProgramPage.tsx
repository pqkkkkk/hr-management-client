import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GeneralInfoCard from "../components/GeneralInfoCard";
import RuleCard from "../components/RuleCard";
import RewardListCard from "../components/RewardListCard";
import { RewardProgramFormData, PolicyType } from "../types/rewardForm";
import { toast } from "react-toastify";
import { useApi } from "contexts/ApiContext";

const EditRewardProgramPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { rewardApi } = useApi();
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        if (id) {
            fetchProgramDetails(id);
        }
    }, [id]);

    const fetchProgramDetails = async (programId: string) => {
        try {
            setLoading(true);
            const response = await rewardApi.getRewardProgramById(programId);
            if (response.success && response.data) {
                const data = response.data;
                setRequest({
                    name: data.name,
                    description: data.description || "",
                    startDate: data.startDate,
                    endDate: data.endDate,
                    defaultGivingBudget: data.defaultGivingBudget,
                    bannerUrl: data.bannerUrl || "",
                    items: data.items.map(item => ({
                        rewardItemId: item.rewardItemId,
                        name: item.name,
                        requiredPoints: item.requiredPoints,
                        quantity: item.quantity,
                        imageUrl: item.imageUrl || ""
                    })),
                    policies: data.policies.map(policy => ({
                        policyId: policy.policyId,
                        policyType: policy.policyType as PolicyType, // Cast to PolicyType
                        unitValue: policy.unitValue,
                        pointsPerUnit: policy.pointsPerUnit,
                    }))
                });
            } else {
                toast.error("Không thể tải thông tin đợt khen thưởng");
            }
        } catch (error) {
            console.error("Error fetching program details:", error);
            toast.error("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

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
        return null;
    };

    const handleUpdate = async () => {
        if (!id) return;

        const validationError = validateRequest();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await rewardApi.updateRewardProgram(id, request);
            if (response.success) {
                toast.success("Cập nhật đợt khen thưởng thành công!");
                navigate("/rewards/programs/current-active");
            } else {
                toast.error("Không thể cập nhật đợt khen thưởng");
            }
        } catch (error) {
            console.error("Error updating reward program:", error);
            toast.error("Lỗi khi cập nhật");
        }
    };

    const handleGeneralInfoChange = (field: string, value: string) => {
        setRequest(prev => ({ ...prev, [field]: value }));
    };

    const handleItemsChange = (items: Array<{
        rewardItemId?: string;
        name: string;
        requiredPoints: number;
        quantity: number;
        imageUrl: string;
    }>) => {
        setRequest(prev => ({ ...prev, items }));
    };

    const handlePoliciesChange = (policies: Array<{
        policyId?: string;
        policyType: any;
        unitValue: number;
        pointsPerUnit: number;
    }>) => {
        setRequest(prev => ({ ...prev, policies }));
    };

    const handleBudgetChange = (budget: number) => {
        setRequest(prev => ({ ...prev, defaultGivingBudget: budget }));
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="text-sm text-gray-500 mb-2 cursor-pointer" onClick={() => navigate("/admin/rewards")}>
                Trang chủ / Quản lý khen thưởng / Chỉnh sửa
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Chỉnh Sửa Đợt Khen Thưởng</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Cập nhật thông tin, quy tắc và danh mục quà tặng.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        onClick={() => navigate("/admin/rewards")}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
                        onClick={handleUpdate}
                    >
                        💾 Lưu thay đổi
                    </button>
                </div>
            </div>

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
                    {/* StatusCard removed or optional for edit? Maybe show current status? */}
                </div>
            </div>
        </div>
    );
};

export default EditRewardProgramPage;
