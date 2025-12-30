import { GeneralInfoCardProps } from '../types/rewardForm';
import ImageUploader from './ImageUploader';

const GeneralInfoCard: React.FC<GeneralInfoCardProps> = ({ data, onChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
          1
        </div>
        <h2 className="font-semibold">Thông tin chung</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-sm font-medium">
            Tên đợt khen thưởng <span className="text-red-500">*</span>
          </label>
          <input
            className="mt-1 w-full border rounded-xl px-4 py-2"
            placeholder="VD: Khen thưởng Quý 4 - 2023"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Ngày bắt đầu *</label>
          <input
            type="date"
            className="mt-1 w-full border rounded-xl px-4 py-2"
            value={data.startDate.split('T')[0]}
            onChange={(e) => onChange('startDate', new Date(e.target.value).toISOString())}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Ngày kết thúc *</label>
          <input
            type="date"
            className="mt-1 w-full border rounded-xl px-4 py-2"
            value={data.endDate.split('T')[0]}
            onChange={(e) => onChange('endDate', new Date(e.target.value).toISOString())}
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium">Mô tả chi tiết</label>
          <textarea
            rows={3}
            className="mt-1 w-full border rounded-xl px-4 py-2"
            placeholder="Mô tả mục đích, ý nghĩa của đợt khen thưởng..."
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <ImageUploader
            label="Banner (Optional)"
            value={data.bannerUrl}
            onChange={(url) => onChange('bannerUrl', url)}
            placeholder="Kéo thả hoặc click để tải banner"
            previewHeight="h-32"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoCard;
