import { Eye, Check } from "lucide-react";
import type { OrderActionEvent } from "../../types/order";
import { useOrderTimer } from "../../hooks/useOrderTimer";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useMarkOrderReadyMutation } from "../../apis/dashboardApi";
import toast from "react-hot-toast";

interface AcceptedOrderCardProps {
  order: OrderActionEvent;
  sequence: number;
}

export const AcceptedOrderCard = ({ order, sequence }: AcceptedOrderCardProps) => {
  const prepTime = order.preparationTime || 15;
  const { displayTime, isOverdue } = useOrderTimer(order.acceptedAt || order.createdAt, "DOWN", prepTime);
  const { moveToReady } = useDashboardStore();
  
  const [markReady, { isLoading }] = useMarkOrderReadyMutation();

  const handleMarkReady = async () => {
    try {
      await markReady({ orderId: order.orderId }).unwrap();
      moveToReady(order.orderId);
      toast.success(`Order ${order.orderId} marked ready`);
    } catch (error) {
      toast.error(`Failed to mark ready for ${order.orderId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 shadow-sm relative hover:shadow-md transition-shadow">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">#{sequence}</span>
          <span className="text-sm font-black text-slate-800 dark:text-zinc-100">{order.orderId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase rounded-md border border-amber-200 dark:border-amber-700/50">
            Prep Time: {prepTime} min
          </span>
          <button className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 transition-colors">
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
        <span className="text-base font-black text-slate-900 dark:text-white">₹{order.totalOrderAmount}</span>
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
            </li>
          ))}
        </ul>
      </div>

      {/* Timer & Progress */}
      <div className="flex flex-col items-center justify-center py-2 mb-4">
        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Remaining</span>
        <span className={`text-2xl font-black tabular-nums ${isOverdue ? 'text-red-600 dark:text-red-500' : 'text-amber-500'}`}>
          {displayTime}
        </span>
        
        {/* Simple Progress Bar */}
        <div className="w-full flex items-center justify-between mt-3 px-2">
           <div className="flex flex-col items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-amber-500"></div>
             <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500">Accepted</span>
           </div>
           <div className="flex-1 h-0.5 bg-amber-200 dark:bg-amber-900/50 mx-1"></div>
           <div className="flex flex-col items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
             <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500">Preparing</span>
           </div>
           <div className="flex-1 h-0.5 bg-slate-200 dark:bg-zinc-700 mx-1"></div>
           <div className="flex flex-col items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-700"></div>
             <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500">Ready</span>
           </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleMarkReady}
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-1.5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
      >
        <Check size={16} /> {isLoading ? "Updating..." : "Mark Ready for Pickup"}
      </button>

    </div>
  );
};
