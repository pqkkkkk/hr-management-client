import { useState } from "react";
import { RewardListCardProps } from "../types/rewardForm";
import ImageUploader from "./ImageUploader";

const RewardListCard: React.FC<RewardListCardProps> = ({ items, onItemsChange }) => {
  const [newItem, setNewItem] = useState({
    name: "",
    requiredPoints: 0,
    quantity: 0,
    imageUrl: ""
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.requiredPoints > 0) {
      onItemsChange([...items, { ...newItem }]);
      setNewItem({ name: "", requiredPoints: 0, quantity: 0, imageUrl: "" });
    }
  };

  const handleRemoveItem = (index: number) => {
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

        <button className="text-indigo-600 font-medium">+ Thêm nhanh</button>
      </div>

      {/* Add form */}
      <div className="border rounded-xl p-4 mb-4 bg-gray-50">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <input
            className="border rounded-xl px-3 py-2 bg-white"
            placeholder="Tên phần thưởng *"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            className="border rounded-xl px-3 py-2 bg-white"
            placeholder="Điểm quy đổi *"
            type="number"
            value={newItem.requiredPoints || ''}
            onChange={(e) => setNewItem({ ...newItem, requiredPoints: parseInt(e.target.value) || 0 })}
          />
          <input
            className="border rounded-xl px-3 py-2 bg-white"
            placeholder="Số lượng (Opt)"
            type="number"
            value={newItem.quantity || ''}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="mb-3">
          <ImageUploader
            value={newItem.imageUrl}
            onChange={(url) => setNewItem({ ...newItem, imageUrl: url })}
            placeholder="Tải ảnh phần thưởng (optional)"
            previewHeight="h-24"
          />
        </div>

        <button
          className="w-full rounded-xl bg-indigo-500 text-white py-2 hover:bg-indigo-600 transition-colors"
          onClick={handleAddItem}
        >
          + Thêm phần thưởng
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
              <tr key={index} className="border-b last:border-none">
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
                <td
                  className="text-right cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(index)}
                >
                  🗑
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
