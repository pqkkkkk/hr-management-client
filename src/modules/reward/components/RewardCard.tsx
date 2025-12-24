import {InfoCardProps} from "../types/rewardCard.type"

export default function RewardCard({
  image,
  title,
  description,
  point,
  disabled,
}: InfoCardProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-sm">
      <img
        src={image}
        alt={title}
        className="h-40 w-full rounded-t-xl object-cover"
      />

      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{description}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-semibold text-blue-600">
            {point} điểm
          </span>

          <button
            disabled={disabled}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              disabled
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {disabled ? "Thiếu điểm" : "Đổi ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}
