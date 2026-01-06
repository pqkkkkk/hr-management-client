import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import {
    Activity,
    ActivityStatus,
    UpdateActivityRequest,
    ActivityTemplate,
    ConfigSchemaResponse,
} from "../types/activity.types";
import { ArrowLeft, Upload, Calendar, FileText, X, Image, Save } from "lucide-react";
import { toast } from "react-toastify";
import ActivityConfigFields from "../components/ActivityConfigFields";

const statusOptions = [
    { value: ActivityStatus.DRAFT, label: "Nháp", color: "bg-gray-100 text-gray-700" },
    { value: ActivityStatus.OPEN, label: "Mở đăng ký", color: "bg-green-100 text-green-700" },
    { value: ActivityStatus.CLOSED, label: "Đóng", color: "bg-orange-100 text-orange-700" },
    { value: ActivityStatus.COMPLETED, label: "Hoàn thành", color: "bg-blue-100 text-blue-700" },
];

const EditActivityPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { activityApi } = useApi();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activity, setActivity] = useState<Activity | null>(null);
    const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
    const [currentTemplate, setCurrentTemplate] = useState<ActivityTemplate | null>(null);
    const [configSchema, setConfigSchema] = useState<ConfigSchemaResponse | null>(null);
    const [configValues, setConfigValues] = useState<Record<string, any>>({});

    // Form state
    const [formData, setFormData] = useState<UpdateActivityRequest>({
        name: "",
        description: "",
        bannerUrl: "",
        startDate: "",
        endDate: "",
    });

    const [newStatus, setNewStatus] = useState<ActivityStatus | null>(null);

    // Banner upload
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch activity
    const fetchActivity = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const response = await activityApi.getActivityById(id);
            if (response.success && response.data) {
                const activity = response.data;
                setActivity(activity);
                setFormData({
                    name: activity.name,
                    description: activity.description || "",
                    bannerUrl: activity.bannerUrl || "",
                    startDate: activity.startDate.split("T")[0],
                    endDate: activity.endDate.split("T")[0],
                });
                if (activity.bannerUrl) {
                    setBannerPreview(activity.bannerUrl);
                }
                setNewStatus(activity.status);

                // Fetch template schema if templateId exists
                if (activity.templateId) {
                    await fetchTemplateSchema(activity.templateId);

                    // Initialize config values from activity or defaults
                    if (activity.config) {
                        setConfigValues(activity.config);
                    }
                }
            } else {
                toast.error(response.message || "Không thể tải thông tin hoạt động");
                navigate("/activities/manage");
            }
        } catch (error) {
            console.error("Error fetching activity:", error);
            toast.error("Đã xảy ra lỗi khi tải thông tin hoạt động");
            navigate("/activities/manage");
        } finally {
            setLoading(false);
        }
    };

    // Fetch template schema
    const fetchTemplateSchema = async (templateId: string) => {
        try {
            const response = await activityApi.getTemplateSchema(templateId);
            if (response.success && response.data) {
                setConfigSchema(response.data);
            }

            // Also fetch template info for display
            const templatesResponse = await activityApi.getActivityTemplates();
            if (templatesResponse.success && templatesResponse.data) {
                const template = templatesResponse.data.find(t => t.templateId === templateId);
                setCurrentTemplate(template || null);
            }
        } catch (error) {
            console.error("Error fetching template schema:", error);
            toast.error("Không thể tải cấu hình template");
        }
    };

    useEffect(() => {
        fetchActivity();
    }, [id, activityApi, navigate]); // Added navigate to dependencies

    // Handle input change
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Handle config field change
    const handleConfigChange = (name: string, value: any) => {
        setConfigValues(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Handle banner file
    const onBannerFile = (file: File | null) => {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.warning("File quá lớn. Tối đa 5MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.warning("Vui lòng chọn file ảnh");
            return;
        }
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        onBannerFile(e.dataTransfer.files?.[0] || null);
    };

    const removeBanner = () => {
        setBannerFile(null);
        setBannerPreview("");
        setFormData((prev) => ({ ...prev, bannerUrl: "" }));
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name?.trim()) {
            newErrors.name = "Vui lòng nhập tên hoạt động";
        }

        if (!formData.startDate) {
            newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
        }

        if (!formData.endDate) {
            newErrors.endDate = "Vui lòng chọn ngày kết thúc";
        }

        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        }

        // Validate config fields
        if (configSchema) {
            configSchema.fields.forEach(field => {
                if (field.required && !configValues[field.name]) {
                    newErrors[field.name] = `${field.label} là bắt buộc`;
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !validateForm()) return;

        setSubmitting(true);
        try {
            // Convert date to datetime (backend expects ISO 8601 date-time)
            const startDateTime = formData.startDate ? new Date(formData.startDate + 'T00:00:00').toISOString() : undefined;
            const endDateTime = formData.endDate ? new Date(formData.endDate + 'T23:59:59').toISOString() : undefined;

            // Update activity info
            const updateResponse = await activityApi.updateActivity(id, {
                ...formData,
                startDate: startDateTime,
                endDate: endDateTime,
                bannerUrl: bannerPreview || undefined,
                config: configValues, // Include config values
            });

            // Update status if changed
            if (newStatus && activity && newStatus !== activity.status) {
                await activityApi.updateActivityStatus(id, newStatus);
            }

            if (updateResponse.success) {
                toast.success("Cập nhật hoạt động thành công!");
                navigate("/activities/manage");
            } else {
                toast.error(updateResponse.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi cập nhật hoạt động");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!id) return;

        const confirmed = window.confirm("Bạn có chắc muốn đóng hoạt động này?");
        if (!confirmed) return;

        try {
            const response = await activityApi.deleteActivity(id);
            console.log("close activity response", response);
            if (response.success) {
                toast.success("Đã đóng hoạt động");
                navigate("/activities/manage");
            } else {
                toast.error(response.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi đóng hoạt động");
        }
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
        <div className="p-6 max-w-6xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => navigate("/activities/manage")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Quay lại</span>
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa hoạt động</h1>
                    <p className="text-gray-600 mt-1">Cập nhật thông tin hoạt động</p>
                </div>
                <button
                    disabled={submitting || !id || activity.status === "CLOSED"}
                    onClick={handleDelete}
                    className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Đóng hoạt động
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Trạng thái hoạt động</h2>
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setNewStatus(opt.value)}
                                className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${newStatus === opt.value
                                    ? `${opt.color} border-current`
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {newStatus !== activity.status && (
                        <p className="text-sm text-blue-600 mt-2">
                            Trạng thái sẽ được thay đổi khi lưu
                        </p>
                    )}
                </div>

                {/* Banner Upload */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        <Image size={16} className="inline mr-2" />
                        Ảnh bìa hoạt động
                    </label>

                    {bannerPreview ? (
                        <div className="relative rounded-lg overflow-hidden">
                            <img
                                src={bannerPreview}
                                alt="Banner preview"
                                className="w-full h-48 object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeBanner}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ) : (
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 ${dragOver
                                ? "border-blue-400 bg-blue-50"
                                : "border-dashed border-gray-300"
                                } rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors`}
                        >
                            <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                            <div className="text-gray-600">Nhấn để tải lên hoặc kéo thả</div>
                            <div className="text-xs text-gray-400 mt-1">PNG, JPG (Tối đa 5MB)</div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => onBannerFile(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                        </div>
                    )}
                </div>

                {/* 2 Column Grid Layout for Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Basic Info & Dates */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <h2 className="font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên hoạt động <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-200"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FileText size={16} className="inline mr-2" />
                                    Mô tả hoạt động
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-semibold text-gray-900 mb-4">
                                <Calendar size={16} className="inline mr-2" />
                                Thời gian
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày bắt đầu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? "border-red-500" : "border-gray-200"
                                            }`}
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày kết thúc <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        min={formData.startDate}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? "border-red-500" : "border-gray-200"
                                            }`}
                                    />
                                    {errors.endDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Activity Config */}
                    <div>
                        {configSchema && (
                            <ActivityConfigFields
                                configSchema={configSchema}
                                configValues={configValues}
                                onChange={handleConfigChange}
                                errors={errors}
                            />
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/activities/manage")}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditActivityPage;
