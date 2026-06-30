import { useState } from "react";
import { Eye, Check, X } from "lucide-react";
import type { OrderActionEvent } from "../../types/order";
import { useOrderTimer } from "../../hooks/useOrderTimer";
import { useDashboardStore } from "../../stores/useDashboardStore";
import { useAcceptOrderMutation, useRejectOrderMutation } from "../../apis/dashboardApi";
import toast from "react-hot-toast";

interface PendingOrderCardProps {
  order: OrderActionEvent;
  sequence: number;
}

const PREP_TIMES = [5, 10, 15, 20, 25, 30];

export const PendingOrderCard = ({ order, sequence }: PendingOrderCardProps) => {
  const [prepTime, setPrepTime] = useState<number>(15);
  const { displayTime } = useOrderTimer(order.createdAt, "UP");
  const { moveToAccepted, removeOrder } = useDashboardStore();
  
  const [acceptOrder, { isLoading: isAccepting }] = useAcceptOrderMutation();
  const [rejectOrder, { isLoading: isRejecting }] = useRejectOrderMutation();

  const handleAccept = async () => {
    try {
      await acceptOrder({ orderId: order.orderId, preparationTime: prepTime }).unwrap();
      moveToAccepted(order.orderId, prepTime);
      toast.success(`Order ${order.orderId} Accepted`);
    } catch (error) {
      toast.error(`Failed to accept order ${order.orderId}`);
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrder({ orderId: order.orderId, reason: "Vendor Rejected" }).unwrap();
      removeOrder(order.orderId);
      toast.success(`Order ${order.orderId} Rejected`);
    } catch (error) {
      toast.error(`Failed to reject order ${order.orderId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/50 rounded-xl p-4 shadow-sm relative hover:shadow-md transition-shadow">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">#{sequence}</span>
          <span className="text-sm font-black text-slate-800 dark:text-zinc-100">{order.orderId}</span>
          <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-black uppercase rounded">New</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 transition-colors">
            <Eye size={16} />
          </button>
          <span className="text-sm font-bold text-red-600 dark:text-red-400">{displayTime}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">{order.customerName}</h4>
          <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">Received {displayTime} ago</p>
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
              <span className="font-bold text-slate-600 dark:text-zinc-400">
                ₹{item.itemPrice ? item.itemPrice * item.itemCount : "--"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Preparation Time Selector */}
      <div className="mb-4">
        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Select Preparation Time</p>
        <div className="flex flex-wrap gap-2">
          {PREP_TIMES.map(time => (
            <button
              key={time}
              onClick={() => setPrepTime(time)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                prepTime === time 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {time} min
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="flex-1 flex justify-center items-center gap-1.5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          <Check size={16} /> {isAccepting ? "Accepting..." : "Accept Order"}
        </button>
        <button
          onClick={handleReject}
          disabled={isRejecting}
          className="flex-1 flex justify-center items-center gap-1.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          <X size={16} /> {isRejecting ? "Rejecting..." : "Reject Order"}
        </button>
      </div>

    </div>
  );
};
