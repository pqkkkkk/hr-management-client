import React, { useEffect, useState } from "react";
import {
  bankOptions,
  departmentOptions,
  genderOptions,
  positionOptions,
} from "../types/profile.types";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import FormDateInput from "../components/FormDateInput";
import { User } from "shared/types";
import { useApi } from "contexts/ApiContext";
import { toast } from "react-toastify";
import { useAuth } from "contexts/AuthContext";

const EmployeePersonalUpdatePage: React.FC = () => {
  const { profileApi } = useApi();
  const { user } = useAuth();
  const [formData, setFormData] = useState<User | undefined>();
  const [isFetchingUserData, setIsFetchingUserData] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsFetchingUserData(true);
        setIsError(false);
        const userData = await profileApi.getProfileById(
          user?.userId || "NV001"
        );
        setFormData(userData.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsError(true);
      } finally {
        setIsFetchingUserData(false);
      }
    };

    fetchUserData();
  }, [profileApi]);

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isFetchingUserData) {
    return <EmployeeFetching />;
  }
  if (isError) {
    return <EmployeeFetchingError />;
  }
  if (!formData) {
    return <EmployeeFetchingError />;
  }

  const validateFormData = () => {
    const phoneRegex = /^0[0-9]{9}$/;
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      toast.error("Số điện thoại phải có 10 số và bắt đầu bằng số 0.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ.");
      return false;
    }

    if (!formData.address || formData.address.trim().length < 5) {
      toast.error("Địa chỉ phải có ít nhất 5 ký tự.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateFormData()) {
      return;
    }

    try {
      setIsSaving(true);

      const updatedUser = await profileApi.updateProfileForEmployee(
        formData.userId,
        formData
      );

      toast.success("Cập nhật thông tin cá nhân thành công.");
      setFormData(updatedUser.data);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin cá nhân.");
      console.error("Error updating user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-3 sm:p-6">
      <div className="w-full max-w-[921px] bg-white border border-black rounded-[10px] p-4 sm:p-6 relative">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-[29px] font-semibold text-black mb-4 sm:mb-6 break-words">
          Thông tin cá nhân - {formData.fullName}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Thông tin công việc */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
                Thông tin công việc
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormInput
                    label="Mã nhân viên"
                    value={formData.userId}
                    disabled={true}
                  />
                  <FormSelect
                    label="Vị trí"
                    value={formData.position}
                    options={positionOptions}
                    disabled={true}
                    onChange={(value) => handleInputChange("position", value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormSelect
                    label="Phòng ban"
                    disabled={true}
                    value={formData.departmentId}
                    options={departmentOptions}
                    onChange={(value) =>
                      handleInputChange("departmentId", value)
                    }
                  />
                  <FormDateInput
                    label="Ngày gia nhập"
                    value={formData.joinDate.toString()}
                    disabled={true}
                    onChange={(value) => handleInputChange("joinDate", value)}
                  />
                </div>
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
                Thông tin liên hệ
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormInput
                    label="SĐT"
                    value={formData.phoneNumber}
                    type="tel"
                    onChange={(value) =>
                      handleInputChange("phoneNumber", value)
                    }
                  />
                  <FormInput
                    label="Email"
                    value={formData.email}
                    type="email"
                    onChange={(value) => handleInputChange("email", value)}
                  />
                </div>
                <FormInput
                  label="Địa chỉ"
                  value={formData.address}
                  onChange={(value) => handleInputChange("address", value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Thông tin cá nhân */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
                Thông tin cá nhân
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 sm:gap-4">
                  <FormInput
                    disabled={true}
                    label="Họ và tên"
                    value={formData.fullName}
                    onChange={(value) => handleInputChange("fullName", value)}
                  />
                  <FormInput
                    disabled={true}
                    label="CCCD"
                    value={formData.identityCardNumber}
                    onChange={(value) =>
                      handleInputChange("identityCardNumber", value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 sm:gap-4">
                  <FormDateInput
                    disabled={true}
                    label="Ngày sinh"
                    value={formData.dateOfBirth.toString()}
                    onChange={(value) =>
                      handleInputChange("dateOfBirth", value)
                    }
                  />
                  <FormSelect
                    disabled={true}
                    label="Giới tính"
                    value={formData.gender}
                    options={genderOptions}
                    onChange={(value) =>
                      handleInputChange(
                        "gender",
                        value as "Nam" | "Nữ" | "Khác"
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Thông tin ngân hàng */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
                Thông tin ngân hàng
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <FormSelect
                  disabled={true}
                  label="Ngân hàng"
                  value={formData.bankName}
                  options={bankOptions}
                  onChange={(value) => handleInputChange("bankName", value)}
                />
                <FormInput
                  disabled={true}
                  label="STK Ngân Hàng"
                  value={formData.bankAccountNumber}
                  onChange={(value) => handleInputChange("bankAccountNumber", value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
          <button
            onClick={handleCancel}
            className="w-full sm:w-[147px] h-[42px] bg-[#887b7c] text-white text-xl sm:text-2xl font-semibold rounded-[10px] border border-black hover:bg-[#6f6465] transition-colors"
          >
            Hủy
          </button>
          <button
            disabled={isSaving}
            onClick={handleSave}
            className="w-full sm:w-[147px] h-[42px] bg-[#186fa5] text-white text-xl sm:text-2xl font-semibold rounded-[10px] border border-black hover:bg-[#14598a] transition-colors"
          >
            {isSaving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeFetching: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-3 sm:p-6">
      <div className="w-full max-w-[921px] bg-white border border-gray-200 rounded-[10px] p-4 sm:p-6 shadow-lg relative">
        {/* Skeleton for Title */}
        <div className="h-6 sm:h-8 bg-gray-200 rounded-md w-2/3 mb-4 sm:mb-6 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column Skeleton */}
          <div className="space-y-6 sm:space-y-8">
            {/* Section 1 */}
            <div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded-md w-1/2 mb-3 sm:mb-4 animate-pulse"></div>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded-md w-1/2 mb-3 sm:mb-4 animate-pulse"></div>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6 sm:space-y-8">
            {/* Section 3 */}
            <div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded-md w-1/2 mb-3 sm:mb-4 animate-pulse"></div>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 sm:gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 sm:gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded-md w-1/2 mb-3 sm:mb-4 animate-pulse"></div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="w-full sm:w-[147px] h-[42px] bg-gray-200 rounded-[10px] animate-pulse"></div>
          <div className="w-full sm:w-[147px] h-[42px] bg-gray-200 rounded-[10px] animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-4 sm:px-6 py-3 rounded-lg shadow-lg border border-gray-200 mx-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg
                className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm sm:text-base text-gray-700 font-medium">
                Đang tải thông tin nhân viên...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeFetchingError: React.FC = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-3 sm:p-6 bg-gray-50">
      <div className="w-full max-w-[600px] bg-white border border-red-200 rounded-[10px] p-6 sm:p-8 shadow-lg">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-3">
          Không thể tải thông tin
        </h2>

        {/* Error Message */}
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
          Đã xảy ra lỗi khi tải thông tin nhân viên. Vui lòng thử lại sau hoặc
          liên hệ bộ phận hỗ trợ nếu vấn đề vẫn tiếp tục.
        </p>

        {/* Error Details (Optional) */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-xs sm:text-sm text-red-800">
            <span className="font-semibold">Lỗi:</span> Không thể kết nối đến
            máy chủ hoặc dữ liệu không hợp lệ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Thử lại
          </button>
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại
          </button>
        </div>

        {/* Support Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Cần hỗ trợ? Liên hệ{" "}
            <a
              href="mailto:support@company.com"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              support@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeePersonalUpdatePage;
