
import { useState } from "react";
import {RewardListCardProps} from "../types/rewardForm";
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
      <div className="grid grid-cols-4 gap-3 mb-3">
        <input 
          className="border rounded-xl px-3 py-2" 
          placeholder="Tên phần thưởng"
          value={newItem.name}
          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
        />
        <input 
          className="border rounded-xl px-3 py-2" 
          placeholder="Điểm (pts)"
          type="number"
          value={newItem.requiredPoints || ''}
          onChange={(e) => setNewItem({...newItem, requiredPoints: parseInt(e.target.value) || 0})}
        />
        <input 
          className="border rounded-xl px-3 py-2" 
          placeholder="Số lượng (Opt)"
          type="number"
          value={newItem.quantity || ''}
          onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
        />
        <button 
          className="rounded-xl bg-indigo-500 text-white"
          onClick={handleAddItem}
        >
          +
        </button>
      </div>

      <textarea
        className="w-full border rounded-xl px-3 py-2 mb-4"
        placeholder="URL hình ảnh (optional)..."
        value={newItem.imageUrl}
        onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})}
      />

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2 text-left">Tên phần thưởng</th>
            <th>Điểm quy đổi</th>
            <th>Số lượng</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b last:border-none">
              <td className="py-3">{item.name}</td>
              <td className="text-indigo-600 font-medium">
                {item.requiredPoints.toLocaleString()} pts
              </td>
              <td>{item.quantity}</td>
              <td 
                className="text-right cursor-pointer"
                onClick={() => handleRemoveItem(index)}
              >
                🗑
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardListCard;
