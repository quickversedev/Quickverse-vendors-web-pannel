import { X, MapPin, Phone, User } from "lucide-react";
import type { OrderActionEvent } from "../../types/order";

interface DashboardOrderDetailModalProps {
  order: OrderActionEvent;
  onClose: () => void;
}

// Helper to format UNIX timestamp or Date string to "02-07-2026, 12:02 PM"
const formatDateTime = (timestamp: string | number | undefined) => {
  if (!timestamp) return "—";
  const date = new Date(Number(timestamp) > 10000000000 ? Number(timestamp) : timestamp);
  if (isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${day}-${month}-${year}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

// Helper to clean up the Java Map toString() format "{name=Test, city=Beed}"
const parseAddress = (addressString: string | undefined) => {
  if (!addressString) return "—";
  if (addressString.startsWith("{") && addressString.endsWith("}")) {
    return addressString.replace(/[{}]/g, '').split(', ').map(s => s.split('=')[1]).filter(Boolean).join(', ');
  }
  return addressString;
};

export const DashboardOrderDetailModal = ({ order, onClose }: DashboardOrderDetailModalProps) => {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all"
      onClick={onClose} // Closes when clicking outside
    >
      <div
        className="relative w-full max-w-xl mx-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the card
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 px-6 py-4 bg-slate-50/50 dark:bg-zinc-950/50">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight">Order Details</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5 font-mono font-semibold">{order.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Body ─── */}
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Top Status & Time Row */}
          <div className="flex items-center justify-between">
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
              order.status === 'PENDING' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' :
              order.status === 'ACCEPTED' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' :
              'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
            }`}>
              {order.status || "NEW"}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              {formatDateTime(order.createdAt)}
            </span>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 p-4">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Total Amount</p>
               <p className="text-lg font-black text-[#1e40af] dark:text-emerald-400">₹{order.totalOrderAmount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 p-4">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">Total Items</p>
               <p className="text-lg font-black text-slate-800 dark:text-zinc-200">{order.totalQuantity}</p>
            </div>
          </div>

          {/* Customer Details Box */}
          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden">
             <div className="bg-slate-50 dark:bg-zinc-900/50 px-4 py-2 border-b border-slate-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer Info</p>
             </div>
             <div className="p-4 space-y-3 bg-white dark:bg-zinc-900 text-sm">
                <div className="flex items-start gap-3">
                   <User size={14} className="text-slate-400 mt-0.5" />
                   <span className="font-semibold text-slate-700 dark:text-zinc-300">{order.customerName || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                   <Phone size={14} className="text-slate-400 mt-0.5" />
                   <span className="font-medium text-slate-600 dark:text-zinc-400">{order.customerPhone || "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                   <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                   <span className="font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
                     {parseAddress(order.customerAddress)}
                   </span>
                </div>
             </div>
          </div>

          {/* Order Items List (Scrollable if > 3 items) */}
          <div className="rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden">
             <div className="bg-slate-50 dark:bg-zinc-900/50 px-4 py-2 border-b border-slate-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Order Items</p>
             </div>
             <div className="p-2 bg-white dark:bg-zinc-900 max-h-[160px] overflow-y-auto custom-scrollbar">
               {order.orderItems?.map((item) => (
                 <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                   <div className="flex flex-col">
                     <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{item.name}</span>
                     <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">Item ID: #{item.id}</span>
                   </div>
                   <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                     ×{item.itemCount}
                   </span>
                 </div>
               ))}
             </div>
          </div>


        </div>
      </div>
    </div>
  );
};