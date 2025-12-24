import {InfoCardProps} from "../types/infor.type"
export default function InfoCard({ title, children, danger }: InfoCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        danger ? "border-red-200 bg-red-50" : "bg-white"
      }`}
    >
      <h3 className="mb-3 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
