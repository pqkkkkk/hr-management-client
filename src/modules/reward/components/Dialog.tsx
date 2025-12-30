import { useState, useEffect } from "react";
import { DialogConfirmProps } from "../types/dialogConfirm.type";

export default function RedeemConfirmDialog({
  open,
  onClose,
  reward,
  currentBalance,
  maxQuantity,
  onSubmit,
  isSubmitting = false,
}: DialogConfirmProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open) setQuantity(1);
  }, [open]);

  if (!open || !reward) return null;

  const price = reward.requiredPoints;
  const total = price * quantity;
  const balanceAfter = currentBalance - total;
  const isNotEnough = balanceAfter < 0;

  // Calculate maximum quantity user can afford
  const maxAffordable = Math.floor(currentBalance / price);
  const effectiveMaxQuantity = Math.min(maxQuantity, maxAffordable);

  const handleIncrease = () => {
    if (quantity < effectiveMaxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isNotEnough && !isSubmitting) {
      await onSubmit(quantity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center">
              ✓
            </div>
            <h2 className="text-lg font-semibold">Xác nhận đổi quà</h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {/* Product info */}
        <div className="flex gap-6 pb-6 border-b">
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="w-32 h-32 rounded-xl object-cover border"
          />

          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">
              {reward.name}
            </h3>
            <p className="text-gray-500 text-sm mb-3">
              Còn lại: {maxQuantity} sản phẩm
            </p>

            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-medium">
              Giá:
              <span className="text-lg font-bold">
                {price.toLocaleString()}
              </span>
              điểm / 1 sản phẩm
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <p className="font-medium mb-2">Số lượng</p>
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 border rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDecrease}
              disabled={quantity <= 1 || isSubmitting}
            >
              −
            </button>

            <div className="w-16 h-10 border rounded-lg flex items-center justify-center">
              {quantity}
            </div>

            <button
              className="w-10 h-10 border rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleIncrease}
              disabled={quantity >= effectiveMaxQuantity || isSubmitting}
            >
              +
            </button>

            {effectiveMaxQuantity > 0 && (
              <span className="text-sm text-gray-500">
                (Tối đa: {effectiveMaxQuantity})
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Đơn giá:</span>
            <span className="font-medium">
              {price.toLocaleString()} điểm
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Số lượng:</span>
            <span className="font-medium">{quantity}</span>
          </div>

          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-semibold">Tổng điểm cần đổi:</span>
            <span className="text-indigo-600 text-xl font-bold">
              {total.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Số dư hiện tại:</span>
            <span>{currentBalance.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Số dư sau khi đổi:</span>
            <span
              className={isNotEnough ? "text-red-500 font-semibold" : ""}
            >
              {balanceAfter.toLocaleString()}
            </span>
          </div>

          {isNotEnough && (
            <div className="mt-3 bg-red-50 text-red-600 text-sm p-3 rounded-lg flex gap-2">
              ⚠️
              <span>
                Số điểm của bạn không đủ để đổi quà này. Vui lòng giảm số
                lượng hoặc chọn quà khác.
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            disabled={isSubmitting}
          >
            ✕ Hủy
          </button>

          <button
            disabled={isNotEnough || isSubmitting || quantity < 1}
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-xl font-medium text-white flex items-center gap-2
              ${isNotEnough || isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Đang xử lý...
              </>
            ) : (
              <>✓ Xác nhận đổi</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
