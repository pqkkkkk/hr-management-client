import React from "react";
import { BulkApproveResponse } from "../types/request.types";

interface Props {
    open: boolean;
    onClose: () => void;
    result: BulkApproveResponse | null;
}

const BulkApproveResultDialog: React.FC<Props> = ({ open, onClose, result }) => {
    if (!open || !result) return null;

    const hasFailures = result.failedCount > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} />
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4 z-10 overflow-hidden transform transition-all">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${hasFailures ? 'bg-yellow-100' : 'bg-green-100'}`}>
                            {hasFailures ? (
                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Kết quả phê duyệt
                            </h3>
                            <div className="mt-4">
                                <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{result.totalProcessed}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Tổng số</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">{result.successCount}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Thành công</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-red-600">{result.failedCount}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Thất bại</div>
                                    </div>
                                </div>

                                {hasFailures && (
                                    <div className="mt-4 text-left">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Chi tiết lỗi:</h4>
                                        <div className="bg-red-50 rounded-md max-h-60 overflow-y-auto">
                                            <ul className="divide-y divide-red-200">
                                                {result.failedRequests.map((item) => (
                                                    <li key={item.requestId} className="p-3 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="font-medium text-gray-900">{item.employeeName}</span>
                                                        </div>
                                                        <div className="text-red-700 mt-1">{item.reason}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {!hasFailures && (
                                    <p className="text-sm text-gray-500">
                                        Tất cả yêu cầu đã được phê duyệt thành công.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkApproveResultDialog;
