import { Eye, Check } from "lucide-react";
import type { OrderActionEvent } from "../../types/order";
import { useOrderTimer } from "../../hooks/useOrderTimer";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useHandoverOrderMutation } from "../../apis/dashboardApi";
import toast from "react-hot-toast";

interface ReadyOrderCardProps {
  order: OrderActionEvent;
  sequence: number;
  onViewDetails: () => void;
}

export const ReadyOrderCard = ({ order, sequence, onViewDetails }: ReadyOrderCardProps) => {
  const { displayTime } = useOrderTimer(order.readyAt || order.acceptedAt || order.createdAt, "UP");
  const { removeOrder } = useDashboardStore();

  const [handover, { isLoading }] = useHandoverOrderMutation();

  const handleHandover = async () => {
    try {
      await handover({ orderId: order.orderId }).unwrap();
      removeOrder(order.orderId); // Done!
      toast.success(`Order ${order.orderId} handed over successfully`);
    } catch (error) {
      toast.error(`Failed to handover ${order.orderId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-green-300 dark:border-green-900/50 rounded-xl p-4 shadow-sm relative hover:shadow-md transition-shadow">

      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">#{sequence}</span>
          <span className="text-sm font-black text-slate-800 dark:text-zinc-100">{order.orderId}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Ready Since</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-500">{displayTime}</span>
          </div>
          <button
            onClick={onViewDetails}
            className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 transition-colors ml-1">
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">{order.customerName}</h4>
          <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">📞 {order.customerPhone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-lg p-2.5 mb-4 border border-slate-100 dark:border-zinc-800/80">
        <ul className="space-y-1.5">
          {order.orderItems?.map((item, idx) => (
            <li key={idx} className="flex justify-between text-xs">
              <span className="text-slate-700 dark:text-zinc-300">
                <span className="font-bold text-slate-500 dark:text-zinc-500 mr-2">{item.itemCount}x</span>
                {item.name}
              </span>
              <span className="font-bold text-slate-600 dark:text-zinc-400">
                ₹{item.itemPrice ? item.itemPrice * item.itemCount : "--"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rider Info */}
      <div className="bg-slate-50 dark:bg-zinc-950/50 rounded-lg p-3 mb-4 border border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase flex items-center gap-1">
            🛵 Rider Assigned
          </span>
          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 mt-1">
            Rider: {order.riderName || "Waiting for Rider"}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
            ETA: <span className="text-blue-600 dark:text-blue-400">{order.riderETA || "--"}</span>
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleHandover}
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-1.5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
      >
        <Check size={16} /> {isLoading ? "Updating..." : "Mark Handed Over"}
      </button>

    </div>
  );
};
