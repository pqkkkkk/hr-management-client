import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import {
    CreateActivityRequest,
    ActivityTemplate,
    ConfigSchemaResponse,
} from "../types/activity.types";
import { ArrowLeft, Upload, Calendar, FileText, X, Image } from "lucide-react";
import { toast } from "react-toastify";
import ActivityConfigFields from "../components/ActivityConfigFields";

const CreateActivityPage: React.FC = () => {
    const navigate = useNavigate();
    const { activityApi } = useApi();
    const { user } = useAuth();

    const [submitting, setSubmitting] = useState(false);
    const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [configSchema, setConfigSchema] = useState<ConfigSchemaResponse | null>(null);
    const [configValues, setConfigValues] = useState<Record<string, any>>({});

    // Form state
    const [formData, setFormData] = useState<CreateActivityRequest>({
        name: "",
        type: "RUNNING",
        templateId: "",
        description: "",
        bannerUrl: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    });

    // Banner file upload
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch templates
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await activityApi.getActivityTemplates();
                if (response.success && response.data) {
                    setTemplates(response.data);
                }
            } catch (error) {
                console.error("Error fetching templates:", error);
            } finally {
                setLoadingTemplates(false);
            }
        };
        fetchTemplates();
    }, [activityApi]);

    // Handle input change
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        // Load config schema when template is selected
        if (name === "templateId" && value) {
            fetchTemplateSchema(value);
        }
    };

    // Fetch template schema
    const fetchTemplateSchema = async (templateId: string) => {
        try {
            const response = await activityApi.getTemplateSchema(templateId);
            if (response.success && response.data) {
                setConfigSchema(response.data);

                // Initialize config values with defaults
                const defaults: Record<string, any> = {};
                response.data.fields.forEach(field => {
                    if (field.defaultValue !== undefined) {
                        defaults[field.name] = field.defaultValue;
                    }
                });
                setConfigValues(defaults);
            }
        } catch (error) {
            console.error("Error fetching template schema:", error);
            toast.error("Không thể tải cấu hình template");
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
        const file = e.dataTransfer.files?.[0];
        onBannerFile(file);
    };

    const removeBanner = () => {
        setBannerFile(null);
        setBannerPreview("");
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên hoạt động";
        }

        if (!formData.templateId) {
            newErrors.templateId = "Vui lòng chọn template";
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

        if (!validateForm()) return;

        setSubmitting(true);
        try {
            // Convert date to datetime (backend expects ISO 8601 date-time)
            const startDateTime = formData.startDate ? new Date(formData.startDate + 'T00:00:00').toISOString() : '';
            const endDateTime = formData.endDate ? new Date(formData.endDate + 'T23:59:59').toISOString() : '';

            // TODO: Upload banner file first, get URL
            const request: CreateActivityRequest = {
                ...formData,
                startDate: startDateTime,
                endDate: endDateTime,
                bannerUrl: bannerPreview || undefined, // In real implementation, use uploaded URL
                config: configValues, // Include config values
            };

            const response = await activityApi.createActivity(request);

            if (response.success) {
                toast.success("Tạo hoạt động thành công!");
                navigate("/activities/manage");
            } else {
                toast.error(response.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra khi tạo hoạt động");
        } finally {
            setSubmitting(false);
        }
    };

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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tạo hoạt động mới</h1>
                <p className="text-gray-600 mt-1">
                    Điền thông tin để tạo hoạt động chạy bộ mới
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="VD: Chạy bộ mùa xuân 2025"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-200"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Type & Template */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại hoạt động
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="RUNNING">Chạy bộ</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Template <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="templateId"
                                        value={formData.templateId}
                                        onChange={handleInputChange}
                                        disabled={loadingTemplates}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 ${errors.templateId ? "border-red-500" : "border-gray-200"
                                            }`}
                                    >
                                        <option value="">-- Chọn template --</option>
                                        {templates.map((t) => (
                                            <option key={t.templateId} value={t.templateId}>
                                                {t.templateName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.templateId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.templateId}</p>
                                    )}
                                </div>
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
                                    placeholder="Mô tả chi tiết về hoạt động..."
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
                        {configSchema ? (
                            <ActivityConfigFields
                                configSchema={configSchema}
                                configValues={configValues}
                                onChange={handleConfigChange}
                                errors={errors}
                            />
                        ) : (
                            /* Placeholder when no template selected */
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="font-semibold text-gray-900 mb-4">Cấu hình hoạt động</h2>
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium mb-1">Chưa có cấu hình</p>
                                    <p className="text-sm text-gray-400">
                                        Cấu hình hoạt động sẽ được hiển thị ở đây khi bạn chọn template
                                    </p>
                                </div>
                            </div>
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
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Đang tạo...
                            </span>
                        ) : (
                            "Tạo hoạt động"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateActivityPage;
