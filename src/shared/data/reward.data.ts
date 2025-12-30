import {
    RewardProgram,
    PointTransaction,
    TransactionType,
    RewardItem,
    RewardPolicy,
} from "modules/reward/types/reward.types";

// Mock reward items
export const mockRewardItems: RewardItem[] = [
    {
        rewardItemId: "item-001",
        programId: "program-003",
        name: "Voucher Grab 100K",
        requiredPoints: 100,
        quantity: 50,
        imageUrl: "https://example.com/grab-voucher.jpg",
    },
    {
        rewardItemId: "item-002",
        programId: "program-003",
        name: "Thẻ quà tặng Shopee 200K",
        requiredPoints: 200,
        quantity: 30,
        imageUrl: "https://example.com/shopee-card.jpg",
    },
    {
        rewardItemId: "item-003",
        programId: "program-003",
        name: "Tai nghe Bluetooth",
        requiredPoints: 500,
        quantity: 10,
        imageUrl: "https://example.com/bluetooth-headphone.jpg",
    },
    {
        rewardItemId: "item-004",
        programId: "program-003",
        name: "Ngày nghỉ phép bổ sung",
        requiredPoints: 1000,
        quantity: 5,
        imageUrl: "https://example.com/day-off.jpg",
    },
];

// Mock reward policies
export const mockRewardPolicies: RewardPolicy[] = [
    {
        policyId: "policy-001",
        programId: "program-003",
        policyType: "NOT_LATE",
        calculationPeriod: "WEEKLY",
        unitValue: 1,
        pointsPerUnit: 10,
        isActive: true,
    },
    {
        policyId: "policy-002",
        programId: "program-003",
        policyType: "FULL_ATTENDANCE",
        calculationPeriod: "MONTHLY",
        unitValue: 1,
        pointsPerUnit: 50,
        isActive: true,
    },
];

// Mock reward programs
export const mockRewardPrograms: RewardProgram[] = [
    {
        rewardProgramId: "program-003",
        name: "Khen Thưởng Thành Tích Quý 3 & 4 - 2024",
        description:
            "Cơ hội đổi những phần quà hấp dẫn dành cho những nỗ lực tuyệt vời của bạn trong suốt thời gian qua.",
        startDate: "2024-06-01T00:00:00.000Z",
        endDate: "2024-12-31T23:59:59.999Z",
        status: "ACTIVE",
        defaultGivingBudget: 10000,
        bannerUrl: "https://example.com/banner1.jpg",
    },
    {
        rewardProgramId: "program-004",
        name: "Chương trình quý 1/2025",
        description: "Chương trình khởi đầu năm mới",
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-03-31T23:59:59.999Z",
        status: "PENDING",
        defaultGivingBudget: 15000,
        bannerUrl: "https://example.com/banner2.jpg",
    },
    {
        rewardProgramId: "program-002",
        name: "Chương trình quý 2/2024",
        description: "Chương trình đã kết thúc",
        startDate: "2024-04-01T00:00:00.000Z",
        endDate: "2024-05-31T23:59:59.999Z",
        status: "INACTIVE",
        defaultGivingBudget: 8000,
        bannerUrl: "https://example.com/banner3.jpg",
    },
];

// Mock user wallets - one for each mock user role
export const mockUserWallets: Array<{
    userWalletId: string;
    userId: string;
    programId: string;
    personalPoint: number;
    givingBudget: number;
}> = [
        // Employee wallet
        {
            userWalletId: "wallet-employee-001",
            userId: "u5e6f7a8-c9d0-1234-ef01-345678901234", // mockEmployee.userId
            programId: "program-003",
            personalPoint: 1250,
            givingBudget: 0, // Employees don't have giving budget
        },
        // Manager wallet
        {
            userWalletId: "wallet-manager-001",
            userId: "u2b3c4d5-f6a7-8901-bcde-f12345678901", // mockManager.userId
            programId: "program-003",
            personalPoint: 2500,
            givingBudget: 5000,
        },
        // Admin wallet
        {
            userWalletId: "wallet-admin-001",
            userId: "u7a8b9c0-e1f2-3456-0123-567890123456", // mockAdmin.userId
            programId: "program-003",
            personalPoint: 3000,
            givingBudget: 10000,
        },
    ];

// Mock transactions
export const mockTransactions: PointTransaction[] = [
    {
        pointTransactionId: "g-12001",
        type: TransactionType.GIFT,
        amount: 500,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet-employee-e-1",
        createdAt: "2025-12-20T08:30:00.000Z",
        items: [],
    },
    {
        pointTransactionId: "g-12002",
        type: TransactionType.GIFT,
        amount: 300,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet-employee-e-2",
        createdAt: "2025-12-18T10:15:00.000Z",
        items: [],
    },
    {
        pointTransactionId: "g-12003",
        type: TransactionType.GIFT,
        amount: 200,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet-employee-e-3",
        createdAt: "2025-12-15T14:45:00.000Z",
        items: [],
    },
    {
        pointTransactionId: "g-12004",
        type: TransactionType.GIFT,
        amount: 150,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet-employee-e-4",
        createdAt: "2025-12-12T09:00:00.000Z",
        items: [],
    },
    {
        pointTransactionId: "8923",
        type: TransactionType.POLICY_REWARD,
        amount: 500,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet2",
        createdAt: "2025-12-22T09:10:05.120Z",
        items: [],
    },
    {
        pointTransactionId: "8810",
        type: TransactionType.EXCHANGE,
        amount: 200,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet-store",
        createdAt: "2025-12-18T14:49:18.943Z",
        items: [
            {
                rewardItemId: "activity-1",
                rewardItemName: "Voucher Grab",
                quantity: 1,
                totalPoints: 200,
            },
        ],
    },
    {
        pointTransactionId: "8755",
        type: TransactionType.POLICY_REWARD,
        amount: 1000,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet2",
        createdAt: "2025-12-24T14:49:18.943Z",
        items: [],
    },
    {
        pointTransactionId: "8100",
        type: TransactionType.POLICY_REWARD,
        amount: 50,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet2",
        createdAt: "2025-12-04T16:05:10.500Z",
        items: [],
    },
    {
        pointTransactionId: "8099",
        type: TransactionType.EXCHANGE,
        amount: 50,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet-store",
        createdAt: "2025-12-02T11:20:00.777Z",
        items: [
            {
                rewardItemId: "store-1",
                rewardItemName: "Cửa hàng",
                quantity: 1,
                totalPoints: 50,
            },
        ],
    },
    {
        pointTransactionId: "8098",
        type: TransactionType.POLICY_REWARD,
        amount: 150,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet2",
        createdAt: "2025-11-29T10:12:30.250Z",
        items: [],
    },
    {
        pointTransactionId: "8097",
        type: TransactionType.POLICY_REWARD,
        amount: 75,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet2",
        createdAt: "2025-11-26T18:03:59.001Z",
        items: [],
    },
    {
        pointTransactionId: "8096",
        type: TransactionType.EXCHANGE,
        amount: 120,
        sourceWalletId: "wallet1",
        destinationWalletId: "wallet-store",
        createdAt: "2025-11-25T13:00:00.999Z",
        items: [
            {
                rewardItemId: "activity-2",
                rewardItemName: "Hoạt động",
                quantity: 1,
                totalPoints: 120,
            },
        ],
    },
];
