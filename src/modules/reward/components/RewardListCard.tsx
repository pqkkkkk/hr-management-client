import { useState } from "react";
import { RewardListCardProps } from "../types/rewardForm";
import ImageUploader from "./ImageUploader";

const RewardListCard: React.FC<RewardListCardProps> = ({ items, onItemsChange }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    requiredPoints: 0,
    quantity: 0,
    imageUrl: ""
  });

  const handleSubmit = () => {
    if (formData.name && formData.requiredPoints > 0) {
      if (editingIndex !== null) {
        // Update existing item
        const updatedItems = [...items];
        updatedItems[editingIndex] = {
          ...updatedItems[editingIndex], // Keep ID if exists
          ...formData
        };
        onItemsChange(updatedItems);
        setEditingIndex(null);
      } else {
        // Add new item
        onItemsChange([...items, { ...formData }]);
      }
      setFormData({ name: "", requiredPoints: 0, quantity: 0, imageUrl: "" });
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const item = items[index];
    setFormData({
      name: item.name,
      requiredPoints: item.requiredPoints,
      quantity: item.quantity,
      imageUrl: item.imageUrl
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ name: "", requiredPoints: 0, quantity: 0, imageUrl: "" });
  };

  const handleRemoveItem = (index: number) => {
    if (editingIndex === index) {
      handleCancel();
    }
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
            2
          </div>
          <h2 className="font-semibold">Danh mục phần thưởng</h2>
        </div>
      </div>

      {/* Form */}
      <div className={`border rounded-xl p-4 mb-4 ${editingIndex !== null ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            {editingIndex !== null ? '🖊 Chỉnh sửa phần thưởng' : '➕ Thêm phần thưởng mới'}
          </span>
          {editingIndex !== null && (
            <button
              onClick={handleCancel}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Hủy bỏ
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <input
            className="border rounded-xl px-3 py-2 bg-white"
            placeholder="Tên phần thưởng *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="border rounded-xl px-3 py-2 bg-white"
            placeholder="Điểm quy đổi *"
            type="number"
            value={formData.requiredPoints || ''}
            onChange={(e) => setFormData({ ...formData, requiredPoints: parseInt(e.target.value) || 0 })}
          />
          <input
            className="border rounded-xl px-3 py-2 bg-white"
            placeholder="Số lượng (Opt)"
            type="number"
            value={formData.quantity || ''}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="mb-3">
          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            placeholder="Tải ảnh phần thưởng (optional)"
            previewHeight="h-24"
          />
        </div>

        <button
          className={`w-full rounded-xl py-2 transition-colors ${editingIndex !== null
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          onClick={handleSubmit}
        >
          {editingIndex !== null ? '💾 Lưu thay đổi' : '+ Thêm phần thưởng'}
        </button>
      </div>

      {/* Table */}
      {items.length > 0 && (
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2 text-left">Phần thưởng</th>
              <th className="text-center">Điểm</th>
              <th className="text-center">Số lượng</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className={`border-b last:border-none ${editingIndex === index ? 'bg-indigo-50' : ''}`}>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="text-indigo-600 font-medium text-center">
                  {item.requiredPoints.toLocaleString()} pts
                </td>
                <td className="text-center">{item.quantity || '∞'}</td>
                <td className="text-right space-x-2">
                  <button
                    className="text-gray-400 hover:text-indigo-600"
                    onClick={() => handleEdit(index)}
                    title="Chỉnh sửa"
                  >
                    ✎
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleRemoveItem(index)}
                    title="Xóa"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {items.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          Chưa có phần thưởng nào. Hãy thêm phần thưởng ở trên.
        </div>
      )}
    </div>
  );
};

export default RewardListCard;
