import RewardCard from "./RewardCard";

export default function RewardList() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RewardCard
        image="https://images.unsplash.com/photo-1518441902117-fdc6f3b5c8b2"
        title="Đồng hồ thông minh Gen 5"
        description="Theo dõi sức khỏe, pin trâu 7 ngày."
        point={1200}
      />

      <RewardCard
        image="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
        title="Voucher Buffet 500k"
        description="Áp dụng tại Golden Gate."
        point={500}
      />

      <RewardCard
        image="https://images.unsplash.com/photo-1518443895914-9b1f5edb6f8d"
        title="Tai nghe chống ồn"
        description="Âm thanh cao cấp."
        point={2500}
        disabled
      />
    </div>
  );
}
