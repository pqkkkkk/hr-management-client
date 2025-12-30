import { useEffect, useState } from 'react';
import { useApi } from 'contexts/ApiContext';
import { RewardProgram } from '../types/reward.types';

const StatusCard: React.FC = () => {
  const { rewardApi } = useApi();
  const [activeProgram, setActiveProgram] = useState<RewardProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveProgram = async () => {
      try {
        setLoading(true);
        const response = await rewardApi.getActiveRewardProgram();
        if (response.success && response.data) {
          setActiveProgram(response.data);
        }
      } catch (error) {
        console.error('Error fetching active program:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveProgram();
  }, [rewardApi]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
      <h2 className="font-semibold mb-2">Trạng thái hệ thống</h2>

      {loading ? (
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          Đang tải...
        </div>
      ) : activeProgram ? (
        <>
          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Đang có 1 đợt Active
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-sm">
            <p className="font-medium">{activeProgram.name}</p>
            <p className="text-white/80 mt-1">
              Kết thúc: {formatDate(activeProgram.endDate)}
            </p>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="w-2 h-2 bg-gray-400 rounded-full" />
          Không có đợt nào đang Active
        </div>
      )}

      <p className="text-xs mt-4 text-white/80">
        ℹ️ Lưu ý: Chỉ có duy nhất một chương trình có thể Active tại một thời điểm. Nên khi kích hoạt chương trình mới sẽ tự động kết thúc chương trình hiện tại.
      </p>
    </div>
  );
};

export default StatusCard;
