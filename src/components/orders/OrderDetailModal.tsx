import { X } from "lucide-react";
import type { OrderApiResponse } from "../../types/order";

// ─── Badge styles (reused from OrderTable) ──────────────────────
const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  ACCEPTED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  REJECTED: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

// ─── Props ──────────────────────────────────────────────────────
interface OrderDetailModalProps {
  order: OrderApiResponse;
  onClose: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = pad(hours) + ':' + minutes + ' ' + ampm;

    return `${day}-${month}-${year}, ${strTime}`;
  } catch (e) {
    return dateString;
  }
};

const pad = (n: number) => String(n).padStart(2, '0');

const renderBadge = (value: string, styleMap: Record<string, string>) => {
  const style = styleMap[value] || "bg-slate-100 dark:bg-zinc-700/40 text-slate-500 dark:text-zinc-400 border-slate-300 dark:border-zinc-600";
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {value}
    </span>
  );
};

// ─── Component ──────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const totalItems = order.totalItemCount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mx-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Order Details</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5 font-mono">{order.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Body ────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Row 1: Status + Payment with labels */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-500">Status</span>
              <span className="text-slate-300 dark:text-zinc-600">:</span>
              {renderBadge(order.state, STATUS_STYLES)}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-500">Payment Method</span>
              <span className="text-slate-300 dark:text-zinc-600">:</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700">
                {order.paymentMethod || "—"}
              </span>
            </div>
          </div>
          {/* Grid: Key details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">Customer</p>
              <p className="text-sm font-medium text-slate-800 dark:text-zinc-200 truncate" title={order.customerName || "—"}> {order.customerName || "—"} </p>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">Timestamp</p>
              <p className="text-sm font-medium text-slate-800 dark:text-zinc-200 truncate" title={formatDate(order.creationTime)}> {formatDate(order.creationTime)}</p>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">Amount</p>
              <p className="text-sm font-bold text-[#1e40af] dark:text-emerald-400">₹{order.totalAmount}</p>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">Total Quantity</p>
              <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">{totalItems} Items</p>
            </div>
          </div>
          {/* Description */}
          <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-1">Description</p>
            <p className="text-sm text-slate-700 dark:text-zinc-300">{order.orderDescription || "—"}</p>
          </div>

          {/* Order Items List */}
          <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-500 mb-2">Order Items</p>
            <div className="space-y-2">
              {order.orderItem.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700/30 transition"
                >
                  <span className="text-sm text-slate-700 dark:text-zinc-300">{item.name}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 bg-slate-200 dark:bg-zinc-700/50 px-2 py-0.5 rounded-full">
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

export default OrderDetailModal;
