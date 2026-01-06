import { useState } from 'react';
import { useApi } from 'contexts/ApiContext';
import { toast } from 'react-toastify';

interface UploadOptions {
    onSuccess?: (url: string) => void;
    onError?: (error: any) => void;
    showToast?: boolean;
    errorMessage?: string;
    successMessage?: string;
}

interface UseFileUploadReturn {
    uploadSingleFile: (file: File | null, options?: UploadOptions) => Promise<string | undefined>;
    uploading: boolean;
    uploadProgress: number;
}

/**
 * Custom hook for handling file uploads with built-in error handling and toast notifications
 * 
 * @example
 * ```tsx
 * const { uploadSingleFile, uploading } = useFileUpload();
 * 
 * const handleSubmit = async () => {
 *   const url = await uploadSingleFile(file, {
 *     errorMessage: 'Không thể tải lên tệp đính kèm.',
 *     successMessage: 'Tải lên thành công!'
 *   });
 *   
 *   if (url) {
 *     // Use the uploaded URL
 *   }
 * };
 * ```
 */
export const useFileUpload = (): UseFileUploadReturn => {
    const { fileApi } = useApi();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    /**
     * Upload a single file to the server
     * 
     * @param file - The file to upload (or null to skip upload)
     * @param options - Upload options including callbacks and toast settings
     * @returns The uploaded file URL, or undefined if upload failed or file is null
     */
    const uploadSingleFile = async (
        file: File | null,
        options: UploadOptions = {}
    ): Promise<string | undefined> => {
        // Return early if no file provided
        if (!file) {
            return undefined;
        }

        const {
            onSuccess,
            onError,
            showToast = true,
            errorMessage = 'Không thể tải lên tệp đính kèm.',
            successMessage,
        } = options;

        setUploading(true);
        setUploadProgress(0);

        try {
            // Call the file upload API
            const uploadResponse = await fileApi.uploadFile(file);

            // Check if upload was successful
            if (uploadResponse.success && uploadResponse.data) {
                const uploadedUrl = uploadResponse.data;
                setUploadProgress(100);

                // Show success toast if enabled
                if (showToast && successMessage) {
                    toast.success(successMessage);
                }

                // Call success callback
                onSuccess?.(uploadedUrl);

                return uploadedUrl;
            } else {
                throw new Error('Upload failed: No URL returned from server');
            }
        } catch (error) {
            console.error('Failed to upload file:', error);

            // Show error toast if enabled
            if (showToast) {
                toast.error(errorMessage);
            }

            // Call error callback
            onError?.(error);

            return undefined;
        } finally {
            setUploading(false);
        }
    };

    return {
        uploadSingleFile,
        uploading,
        uploadProgress,
    };
};
