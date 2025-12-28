import RewardHeader from "../components/RewardHeader";
import InfoCard from "../components/InfoCard";
import RewardList from "../components/RewardList";
import RedeemConfirmDialog from "../components/Dialog";
import { useState } from "react";

export default function RewardDetailPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="space-y-8 p-6">
      <RewardHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-1">
          <InfoCard title="⏰ Thời hạn điểm" danger>
            <p className="text-sm text-gray-600">
              Điểm thưởng sẽ hết hạn vào:
            </p>
            <p className="mt-2 font-semibold">31/12/2024</p>
          </InfoCard>

          <InfoCard title="⭐ Cách tích điểm">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✔ Hoàn thành OKRs: +50 điểm</li>
              <li>✔ Được đồng nghiệp khen: +10 điểm</li>
              <li>✔ Hoàn thành khóa học: +100 điểm</li>
            </ul>
          </InfoCard>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">🎁 Danh mục quà tặng</h2>

            <div className="flex gap-2">
              <select className="rounded-lg border px-3 py-2 text-sm">
                <option>Tất cả quà tặng</option>
              </select>

              <select className="rounded-lg border px-3 py-2 text-sm">
                <option>Điểm: Thấp → Cao</option>
              </select>
            </div>
          </div>

          <RewardList />
        </div>
      </div>
    </div>
  );
}
