import { useEffect, useState, useCallback } from "react";
import { useApi } from "contexts/ApiContext";
import { toast } from "react-toastify";
import {
    RewardProgramDetail,
    UserWallet,
    DistributePointsResponse,
    RewardPolicy,
    RewardItem,
} from "../types/reward.types";
import { Page } from "shared/types";
import {
    Info,
    Award,
    Users,
    Zap,
    Gift,
    Calendar,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ========== TYPES ==========
type TabType = "overview" | "policies" | "users" | "distribution";

// ========== SUB-COMPONENTS ==========

// Tab Navigation Component
interface TabNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    const tabClass = (tab: TabType) =>
        `flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === tab
            ? "text-blue-600 border-blue-600"
            : "text-gray-600 border-transparent hover:text-gray-900"
        }`;

    return (
        <div className="border-b border-gray-200 bg-white">
            <div className="flex overflow-x-auto">
                <button onClick={() => onTabChange("overview")} className={tabClass("overview")}>
                    <Info size={18} />
                    <span>Tổng quan</span>
                </button>
                <button onClick={() => onTabChange("policies")} className={tabClass("policies")}>
                    <Award size={18} />
                    <span>Chính sách & Phần thưởng</span>
                </button>
                <button onClick={() => onTabChange("users")} className={tabClass("users")}>
                    <Users size={18} />
                    <span>Người dùng</span>
                </button>
                <button onClick={() => onTabChange("distribution")} className={tabClass("distribution")}>
                    <Zap size={18} />
                    <span>Phân phối điểm</span>
                </button>
            </div>
        </div>
    );
};

// Stat Card Component
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass }) => (
    <div className={`p-4 rounded-lg ${colorClass}`}>
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/50">{icon}</div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm opacity-80">{label}</div>
            </div>
        </div>
    </div>
);

// Overview Tab Component
interface OverviewTabProps {
    program: RewardProgramDetail;
    totalUsers: number;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ program, totalUsers }) => (
    <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                icon={<Calendar size={24} className="text-blue-600" />}
                label="Ngày bắt đầu"
                value={new Date(program.startDate).toLocaleDateString("vi-VN")}
                colorClass="bg-blue-50 text-blue-900"
            />
            <StatCard
                icon={<Calendar size={24} className="text-purple-600" />}
                label="Ngày kết thúc"
                value={new Date(program.endDate).toLocaleDateString("vi-VN")}
                colorClass="bg-purple-50 text-purple-900"
            />
            <StatCard
                icon={<Users size={24} className="text-green-600" />}
                label="Người tham gia"
                value={totalUsers}
                colorClass="bg-green-50 text-green-900"
            />
            <StatCard
                icon={<Award size={24} className="text-orange-600" />}
                label="Số chính sách"
                value={program.policies?.length || 0}
                colorClass="bg-orange-50 text-orange-900"
            />
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-3">Mô tả chương trình</h3>
            <p className="text-gray-600">{program.description || "Chưa có mô tả"}</p>
        </div>

        {/* Quick Policy Summary */}
        <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Tổng quan chính sách tích điểm</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {program.policies?.map((policy, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <div className="font-medium text-blue-900 mb-1">
                            {policy.policyType === "NOT_LATE" && "🕐 Không đi trễ"}
                            {policy.policyType === "OVERTIME" && "⏰ Làm thêm giờ"}
                            {policy.policyType === "FULL_ATTENDANCE" && "📅 Làm đủ công"}
                        </div>
                        <div className="text-sm text-blue-700">
                            +{policy.pointsPerUnit} điểm / {policy.unitValue} {policy.policyType === "OVERTIME" ? "phút" : "ngày"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Policies Tab Component
interface PoliciesTabProps {
    policies: RewardPolicy[];
    items: RewardItem[];
}

const PoliciesTab: React.FC<PoliciesTabProps> = ({ policies, items }) => (
    <div className="space-y-6">
        {/* Policies Section */}
        <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award size={20} className="text-yellow-600" />
                Chính sách tích điểm
            </h3>
            <div className="space-y-4">
                {policies.map((policy, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-yellow-100">
                                {policy.policyType === "NOT_LATE" && <span className="text-2xl">🕐</span>}
                                {policy.policyType === "OVERTIME" && <span className="text-2xl">⏰</span>}
                                {policy.policyType === "FULL_ATTENDANCE" && <span className="text-2xl">📅</span>}
                            </div>
                            <div>
                                <div className="font-medium">
                                    {policy.policyType === "NOT_LATE" && "Không đi trễ"}
                                    {policy.policyType === "OVERTIME" && "Làm thêm giờ"}
                                    {policy.policyType === "FULL_ATTENDANCE" && "Làm đủ công"}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Mỗi {policy.unitValue} {policy.policyType === "OVERTIME" ? "phút" : "ngày"} nhận {policy.pointsPerUnit} điểm
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-green-600">+{policy.pointsPerUnit}</div>
                            <div className="text-xs text-gray-500">điểm</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Reward Items Section */}
        <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Gift size={20} className="text-pink-600" />
                Phần thưởng có thể đổi
            </h3>
            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Chưa có phần thưởng nào được thiết lập
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.rewardItemId} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
                            ) : (
                                <div className="w-full h-32 bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
                                    <Gift size={40} className="text-pink-300" />
                                </div>
                            )}
                            <div className="p-4">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-500 line-clamp-2">{item.name}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-lg font-bold text-blue-600">{item.requiredPoints} điểm</span>
                                    <span className="text-xs text-gray-400">Còn {item.quantity || "∞"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

// Users Tab Component
interface UsersTabProps {
    wallets: Page<UserWallet> | null;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ wallets, currentPage, onPageChange }) => (
    <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold flex items-center gap-2">
                <Users size={18} />
                Danh sách người dùng ({wallets?.totalElements || 0} người)
            </h3>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">STT</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tên nhân viên</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Điểm cá nhân</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Ngân sách tặng</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {wallets?.content.map((wallet, idx) => (
                        <tr key={wallet.userWalletId} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                                {(currentPage - 1) * 10 + idx + 1}
                            </td>
                            <td className="px-4 py-3">
                                <div className="font-medium">{wallet.userName || wallet.userId}</div>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className="font-bold text-blue-600">{wallet.personalPoint}</span>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-500">{wallet.givingBudget}</td>
                        </tr>
                    ))}
                    {(!wallets || wallets.content.length === 0) && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                Chưa có người dùng nào tham gia chương trình
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        {wallets && wallets.totalPages > 1 && (
            <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Trang {currentPage} / {wallets.totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: Math.min(5, wallets.totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-1 rounded ${currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-white border hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= wallets.totalPages}
                        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        )}
    </div>
);

// Distribution Tab Component
interface DistributionTabProps {
    programId: string;
    startDate: string;
    endDate: string;
    isDistributing: boolean;
    distributionResult: DistributePointsResponse | null;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onDistribute: () => void;
}

const DistributionTab: React.FC<DistributionTabProps> = ({
    startDate,
    endDate,
    isDistributing,
    distributionResult,
    onStartDateChange,
    onEndDateChange,
    onDistribute,
}) => (
    <div className="space-y-6">
        {/* Distribution Form */}
        <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-600" />
                Phân phối điểm tự động
            </h3>
            <p className="text-gray-600 mb-6">
                Tính toán và phân phối điểm thưởng cho nhân viên dựa trên dữ liệu chấm công trong khoảng thời gian được chọn.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <button
                onClick={onDistribute}
                disabled={isDistributing}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-medium transition"
            >
                {isDistributing ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Đang xử lý...</span>
                    </>
                ) : (
                    <>
                        <Zap size={18} />
                        <span>Bắt đầu phân phối điểm</span>
                    </>
                )}
            </button>
        </div>

        {/* Distribution Result */}
        {distributionResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-green-100 border-b border-green-200">
                    <h4 className="font-semibold text-green-800 flex items-center gap-2">
                        ✅ Kết quả phân phối thành công
                    </h4>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-green-600">{distributionResult.totalUsersProcessed}</div>
                            <div className="text-sm text-gray-600">Người nhận điểm</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">{distributionResult.totalPointsDistributed}</div>
                            <div className="text-sm text-gray-600">Tổng điểm đã phát</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg">
                            <div className="text-3xl font-bold text-purple-600">{distributionResult.totalTransactionsCreated}</div>
                            <div className="text-sm text-gray-600">Giao dịch tạo mới</div>
                        </div>
                    </div>

                    {/* User Summaries */}
                    {distributionResult.userSummaries.length > 0 && (
                        <div>
                            <h5 className="font-medium mb-3">Chi tiết theo người dùng:</h5>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {distributionResult.userSummaries.map((user, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                        <div>
                                            <div className="font-medium">{user.userName}</div>
                                            <div className="text-xs text-gray-500">
                                                {Object.entries(user.pointsByPolicy).map(([policy, points]) => (
                                                    <span key={policy} className="mr-2">{policy}: +{points}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold text-green-600">+{user.pointsEarned}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
);

// ========== MAIN COMPONENT ==========

export default function AdminRewardManagementPage() {
    const { rewardApi } = useApi();
    const navigate = useNavigate();

    const [program, setProgram] = useState<RewardProgramDetail | null>(null);
    const [wallets, setWallets] = useState<Page<UserWallet> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDistributing, setIsDistributing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    // Date range for distribution
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);

    // Distribution result
    const [distributionResult, setDistributionResult] = useState<DistributePointsResponse | null>(null);

    const fetchProgram = useCallback(async () => {
        try {
            const response = await rewardApi.getActiveRewardProgram();
            if (response.success) {
                setProgram(response.data);
                return response.data.rewardProgramId;
            }
        } catch (error) {
            console.error("Error fetching program:", error);
            toast.error("Không thể tải chương trình khen thưởng");
        }
        return null;
    }, [rewardApi]);

    const fetchWallets = useCallback(async (programId: string, page: number) => {
        try {
            const response = await rewardApi.getWalletsByProgram(programId, page, 10);
            setWallets(response);
        } catch (error) {
            console.error("Error fetching wallets:", error);
        }
    }, [rewardApi]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const programId = await fetchProgram();
            if (programId) {
                await fetchWallets(programId, 1);
            }
            setIsLoading(false);
        };
        loadData();
    }, [fetchProgram, fetchWallets]);

    const handleDistributePoints = async () => {
        if (!program) return;

        setIsDistributing(true);
        setDistributionResult(null);

        try {
            const result = await rewardApi.distributePoints(
                program.rewardProgramId,
                startDate,
                endDate
            );
            setDistributionResult(result);
            toast.success(`Đã phân phối ${result.totalPointsDistributed} điểm cho ${result.totalUsersProcessed} người dùng`);

            // Refresh wallets
            await fetchWallets(program.rewardProgramId, currentPage);
        } catch (error) {
            console.error("Error distributing points:", error);
            toast.error("Phân phối điểm thất bại");
        } finally {
            setIsDistributing(false);
        }
    };

    const handlePageChange = async (page: number) => {
        if (!program || page < 1 || (wallets && page > wallets.totalPages)) return;
        setCurrentPage(page);
        await fetchWallets(program.rewardProgramId, page);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-gray-500 text-lg">Không có chương trình khen thưởng nào đang hoạt động</div>
                <button
                    onClick={() => navigate("/rewards/programs/create")}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Tạo chương trình mới
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{program.name}</h1>
                            <p className="text-blue-100 mt-1">{program.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${program.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-100 border border-green-400/30"
                                : "bg-gray-500/20 text-gray-100"
                                }`}>
                                {program.status === "ACTIVE" ? "🟢 Đang hoạt động" : program.status}
                            </span>
                            <button
                                onClick={() => navigate(`/rewards/programs/edit/${program.rewardProgramId}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                                title="Chỉnh sửa chương trình"
                            >
                                <Settings size={18} />
                                <span>Tùy chỉnh</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === "overview" && (
                    <OverviewTab program={program} totalUsers={wallets?.totalElements || 0} />
                )}

                {activeTab === "policies" && (
                    <PoliciesTab
                        policies={program.policies || []}
                        items={program.items || []}
                    />
                )}

                {activeTab === "users" && (
                    <UsersTab
                        wallets={wallets}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}

                {activeTab === "distribution" && (
                    <DistributionTab
                        programId={program.rewardProgramId}
                        startDate={startDate}
                        endDate={endDate}
                        isDistributing={isDistributing}
                        distributionResult={distributionResult}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onDistribute={handleDistributePoints}
                    />
                )}
            </div>
        </div>
    );
}
