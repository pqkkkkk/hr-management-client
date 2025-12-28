
import {RewardItem2} from "../types/reward.types";
const rewards: RewardItem2[] = [
  { id: 1, name: "Voucher Gojek 100k", points: 1000, quantity: 50 },
  { id: 2, name: "Áo Polo Công ty", points: 2500, quantity: 100 },
];

const RewardListCard: React.FC = () => {
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
        <input className="border rounded-xl px-3 py-2" placeholder="Tên phần thưởng" />
        <input className="border rounded-xl px-3 py-2" placeholder="Điểm (pts)" />
        <input className="border rounded-xl px-3 py-2" placeholder="Số lượng (Opt)" />
        <button className="rounded-xl bg-indigo-500 text-white">+</button>
      </div>

      <textarea
        className="w-full border rounded-xl px-3 py-2 mb-4"
        placeholder="Mô tả ngắn..."
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
          {rewards.map((item) => (
            <tr key={item.id} className="border-b last:border-none">
              <td className="py-3">{item.name}</td>
              <td className="text-indigo-600 font-medium">
                {item.points.toLocaleString()} pts
              </td>
              <td>{item.quantity}</td>
              <td className="text-right cursor-pointer">🗑</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardListCard;
