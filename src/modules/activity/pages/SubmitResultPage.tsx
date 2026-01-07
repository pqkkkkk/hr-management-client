import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import {
    Activity,
    CreateActivityLogRequest,
} from "../types/activity.types";
import { ArrowLeft, Upload, Calendar, Clock, MapPin, X } from "lucide-react";
import { toast } from "react-toastify";
import { useFileUpload } from "shared/hooks/useFileUpload";

const SubmitResultPage: React.FC = () => {
    const { id: activityId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { activityApi } = useApi();
    const { user } = useAuth();
    const { uploadSingleFile, uploading } = useFileUpload();

    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        distance: "",
        durationMinutes: "",
        logDate: new Date().toISOString().split("T")[0],
    });

    // File upload state
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch activity details
    const fetchActivity = useCallback(async () => {
        if (!activityId) return;

        setLoading(true);
        try {
            const response = await activityApi.getActivityById(activityId);
            if (response.success && response.data) {
                setActivity(response.data);
            }
        } catch (error) {
            console.error("Error fetching activity:", error);
            toast.error("Không thể tải thông tin hoạt động");
        } finally {
            setLoading(false);
        }
    }, [activityId, activityApi]);

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

    // Handle file selection
    const onFiles = (fList: FileList | null) => {
        if (!fList || fList.length === 0) return;
        const selectedFile = fList[0];
        // Filter by size (max 5MB) and only images
        if (selectedFile.size <= 5 * 1024 * 1024 && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
        } else {
            toast.warning("Chỉ chấp nhận file ảnh dưới 5MB");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        onFiles(e.dataTransfer.files);
    };

    const removeFile = () => {
        setFile(null);
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.distance || parseFloat(formData.distance) <= 0) {
            newErrors.distance = "Vui lòng nhập quãng đường hợp lệ";
        }

        if (!formData.durationMinutes || parseInt(formData.durationMinutes) <= 0) {
            newErrors.durationMinutes = "Vui lòng nhập thời gian hợp lệ";
        }

        if (!formData.logDate) {
            newErrors.logDate = "Vui lòng chọn ngày chạy";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !activityId) return;

        setSubmitting(true);
        try {
            // Upload proof image first if exists
            let proofUrl: string | undefined;
            if (file) {
                proofUrl = await uploadSingleFile(file, {
                    errorMessage: 'Không thể tải lên ảnh chứng minh.',
                });
            }

            const request: CreateActivityLogRequest = {
                activityId,
                employeeId: user?.userId,
                employeeName: user?.fullName,
                distance: parseFloat(formData.distance),
                durationMinutes: parseInt(formData.durationMinutes),
                logDate: new Date(formData.logDate).toISOString(),
                proofUrl: proofUrl, // Set uploaded URL or undefined
            };

            const response = await activityApi.createActivityLog(request);

            if (response.success) {
                toast.success("Ghi nhận kết quả thành công! Đang chờ phê duyệt.");
                navigate(`/activities/${activityId}`);
            } else {
                toast.error(response.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi ghi nhận kết quả");
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate pace
    const calculatePace = (): string => {
        const distance = parseFloat(formData.distance);
        const duration = parseInt(formData.durationMinutes);

        if (distance > 0 && duration > 0) {
            const paceMinPerKm = duration / distance;
            const mins = Math.floor(paceMinPerKm);
            const secs = Math.round((paceMinPerKm - mins) * 60);
            return `${mins}:${secs.toString().padStart(2, "0")} /km`;
        }
        return "--:-- /km";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                    Không tìm thấy hoạt động
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate(`/activities/${activityId}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Quay lại</span>
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Ghi nhận kết quả
                </h1>
                <p className="text-gray-600">
                    Hoạt động: <span className="font-medium">{activity.name}</span>
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
                {/* Distance */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin size={16} className="inline mr-2" />
                        Quãng đường (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="distance"
                        value={formData.distance}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        placeholder="Ví dụ: 5.5"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.distance ? "border-red-500" : "border-gray-200"
                            }`}
                    />
                    {errors.distance && (
                        <p className="text-red-500 text-sm mt-1">{errors.distance}</p>
                    )}
                </div>

                {/* Duration */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock size={16} className="inline mr-2" />
                        Thời gian (phút) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="durationMinutes"
                        value={formData.durationMinutes}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Ví dụ: 30"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.durationMinutes ? "border-red-500" : "border-gray-200"
                            }`}
                    />
                    {errors.durationMinutes && (
                        <p className="text-red-500 text-sm mt-1">{errors.durationMinutes}</p>
                    )}
                </div>

                {/* Pace Display */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700 mb-1">Tốc độ trung bình</div>
                    <div className="text-2xl font-bold text-blue-600">{calculatePace()}</div>
                </div>

                {/* Date */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Ngày chạy <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="logDate"
                        value={formData.logDate}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split("T")[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.logDate ? "border-red-500" : "border-gray-200"
                            }`}
                    />
                    {errors.logDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.logDate}</p>
                    )}
                </div>

                {/* File Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Upload size={16} className="inline mr-2" />
                        Ảnh chứng minh (không bắt buộc)
                    </label>
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`border-2 ${dragOver
                            ? "border-blue-400 bg-blue-50"
                            : "border-dashed border-gray-300 bg-white"
                            } rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <div className="text-gray-600">Nhấn để tải lên hoặc kéo thả</div>
                        <div className="text-xs text-gray-400 mt-1">
                            PNG, JPG (Tối đa 5MB)
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => onFiles(e.target.files)}
                            className="hidden"
                        />
                    </div>

                    {/* File Preview */}
                    {file && (
                        <div className="mt-3 flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
                            <div className="flex items-center gap-3">
                                {/* Preview thumbnail */}
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <div>
                                    <div className="font-medium text-sm">{file.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Xóa
                            </button>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                        Bạn có thể đính kèm ảnh chụp màn hình từ ứng dụng chạy bộ (Strava, Nike Run Club, ...)
                    </p>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(`/activities/${activityId}`)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Đang tải lên ảnh...
                            </span>
                        ) : submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Đang gửi kết quả...
                            </span>
                        ) : (
                            "Ghi nhận kết quả"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitResultPage;
