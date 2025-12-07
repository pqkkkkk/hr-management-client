import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AttendanceData {
  day: string;
  date: string;
  onTimeRate: number;
  lateCount: number;
  absentCount: number;
}

interface TeamAttendanceChartProps {
  data: AttendanceData[];
  isLoading?: boolean;
  weeklyAverage?: number;
  onTimeToday?: number;
  notCheckedInToday?: number;
}

const TeamAttendanceChart: React.FC<TeamAttendanceChartProps> = ({ 
  data, 
  isLoading = false,
  weeklyAverage = 0,
  onTimeToday = 0,
  notCheckedInToday = 0,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình hình chấm công</h3>
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const maxRate = Math.max(...data.map(d => d.onTimeRate), 100);
  const previousWeekAverage = weeklyAverage > 0 ? weeklyAverage - 2 : 85; // Mock data
  const trend = weeklyAverage - previousWeekAverage;
  const isPositiveTrend = trend >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tình hình chấm công</h3>
        <div className="text-sm text-gray-500">7 ngày gần nhất</div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="flex items-end justify-between h-48 space-x-2">
          {data.map((item, index) => {
            const height = (item.onTimeRate / maxRate) * 100;
            const isToday = index === data.length - 1;
            const barColor = 
              item.onTimeRate >= 90 ? 'bg-green-500' :
              item.onTimeRate >= 70 ? 'bg-yellow-500' :
              'bg-red-500';

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <div className="relative group w-full">
                    <div
                      className={`${barColor} ${isToday ? 'opacity-100' : 'opacity-80'} rounded-t transition-all hover:opacity-100 w-full`}
                      style={{ height: `${height}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap">
                        <div className="font-semibold">{item.date}</div>
                        <div>Đúng giờ: {item.onTimeRate}%</div>
                        <div>Muộn: {item.lateCount} người</div>
                        <div>Vắng: {item.absentCount} người</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`text-xs mt-2 ${isToday ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                  {item.day}
                </div>
                <div className="text-xs text-gray-400">{item.onTimeRate}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <div className="text-sm text-gray-600">TB tuần này</div>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-gray-900">{weeklyAverage}%</span>
            <span className={`ml-2 inline-flex items-center text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveTrend ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-600">Đúng giờ hôm nay</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{onTimeToday} người</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-600">Chưa check-in</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {notCheckedInToday} người
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span className="text-xs text-gray-600">≥90%: Tốt</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span className="text-xs text-gray-600">70-89%: TB</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
          <span className="text-xs text-gray-600">&lt;70%: Cần cải thiện</span>
        </div>
      </div>
    </div>
  );
};

export default TeamAttendanceChart;
