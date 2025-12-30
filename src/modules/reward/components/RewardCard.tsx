import { InfoCardProps } from "../types/rewardCard.type";

export default function RewardCard({
  item,
  currentBalance,
  onRedeem,
}: InfoCardProps) {
  const isDisabled = item.quantity === 0 || currentBalance < item.requiredPoints;
  const buttonText = item.quantity === 0
    ? "Hết hàng"
    : currentBalance < item.requiredPoints
      ? "Thiếu điểm"
      : "Đổi ngay";

  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-sm">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="h-40 w-full rounded-t-xl object-cover"
      />

      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-semibold">{item.name}</h4>
        <p className="mt-1 text-sm text-gray-500">
          Còn {item.quantity} phần
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-semibold text-blue-600">
            {item.requiredPoints.toLocaleString()} điểm
          </span>

          <button
            disabled={isDisabled}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${isDisabled
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            onClick={() => onRedeem(item)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
