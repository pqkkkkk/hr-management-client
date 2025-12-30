import { useState, useRef, useCallback } from 'react';
import { useApi } from 'contexts/ApiContext';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    previewHeight?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    label,
    placeholder = 'Kéo thả hoặc click để tải ảnh lên',
    className = '',
    previewHeight = 'h-40',
}) => {
    const { fileApi } = useApi();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Chỉ chấp nhận file ảnh');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File quá lớn. Tối đa 5MB');
            return;
        }

        setError(null);
        setUploading(true);
        setProgress(0);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        try {
            const response = await fileApi.uploadFile(file);
            if (response.success && response.data) {
                onChange(response.data);
            } else {
                setError('Upload thất bại. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi upload');
            console.error('Upload error:', err);
        } finally {
            clearInterval(progressInterval);
            setProgress(100);
            setTimeout(() => {
                setUploading(false);
                setProgress(0);
            }, 300);
        }
    }, [fileApi, onChange]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleRemove = () => {
        onChange('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            {label && <label className="text-sm font-medium block mb-2">{label}</label>}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {value ? (
                // Preview mode
                <div className="relative group">
                    <img
                        src={value}
                        alt="Preview"
                        className={`w-full ${previewHeight} object-cover rounded-xl border`}
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                // Upload mode
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            ${previewHeight} border-2 border-dashed rounded-xl cursor-pointer
            flex flex-col items-center justify-center gap-2 transition-colors
            ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
            ${uploading ? 'pointer-events-none' : ''}
          `}
                >
                    {uploading ? (
                        <>
                            <div className="text-indigo-500">📤 Đang tải lên...</div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-200"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="text-2xl">📷</span>
                            <span className="text-gray-500 text-sm">{placeholder}</span>
                            <span className="text-gray-400 text-xs">PNG, JPG tối đa 5MB</span>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="text-red-500 text-xs mt-2">⚠️ {error}</p>
            )}
        </div>
    );
};

export default ImageUploader;
