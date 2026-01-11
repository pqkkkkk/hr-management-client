import React from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    pendingCount: number;
    isLoading?: boolean;
};

const RATE_LIMIT = 50;

const ConfirmationBulkApprove: React.FC<Props> = ({
    open,
    onClose,
    onConfirm,
    pendingCount,
    isLoading = false,
}) => {
    if (!open) return null;

    const exceedsLimit = pendingCount > RATE_LIMIT;
    const processCount = Math.min(pendingCount, RATE_LIMIT);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full mx-4 z-10">
                <div className="p-8 text-center">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <h3 className="text-xl font-semibold">Phê duyệt tất cả yêu cầu?</h3>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{pendingCount}</p>
                        <p className="text-sm text-gray-600">yêu cầu đang chờ duyệt</p>
                    </div>

                    {exceedsLimit && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                ⚠️ Giới hạn tối đa {RATE_LIMIT} yêu cầu mỗi lần. Chỉ có{" "}
                                <strong>{RATE_LIMIT}</strong> yêu cầu sẽ được xử lý.
                            </p>
                        </div>
                    )}

                    <p className="mt-4 text-sm text-gray-600">
                        Bạn sẽ phê duyệt <strong>{processCount}</strong> yêu cầu. Hành động
                        này không thể hoàn tác.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading || pendingCount === 0}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            )}
                            Phê duyệt tất cả
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationBulkApprove;
