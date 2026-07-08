import { X, Phone, User, Store, Navigation } from "lucide-react";
import type { OrderActionEvent } from "../../types/order";

interface OrderDetailsModalProps {
    order: OrderActionEvent;
    onClose: () => void;
}

// --- BULLETPROOF Address Parser (Handles BOTH new Object AND old Java Map String) ---
const parseAddress = (addr: any) => {
    if (!addr) return "—";

    // Case 1: Old Backend Format (Java Map String e.g. "{name=Faizan, city=Beed}")
    if (typeof addr === 'string') {
        if (addr.startsWith("{") && addr.endsWith("}")) {
            const parts = addr.slice(1, -1).split(", ");
            const addrObj: Record<string, string> = {};
            parts.forEach(p => {
                const firstEqual = p.indexOf("=");
                if (firstEqual > -1) {
                    const k = p.substring(0, firstEqual).trim();
                    const v = p.substring(firstEqual + 1).trim();
                    addrObj[k] = v;
                }
            });
            // Extract only clean address fields
            const lines = [
                addrObj.addressLine1, 
                addrObj.addressLine2, 
                addrObj.addressLine3, 
                addrObj.city, 
                addrObj.state, 
                addrObj.pincode
            ].filter(Boolean);
            
            return lines.length > 0 ? lines.join(", ") : addr;
        }
        return addr; // Normal plain string fallback
    }

    // Case 2: New Clean JSON Format (Object)
    const lines = [
        addr.addressLine1,
        addr.addressLine2,
        addr.addressLine3,
        addr.city,
        addr.state,
        addr.pincode
    ].filter(Boolean);

    return lines.length > 0 ? lines.join(", ") : "—";
};

// --- Smart Date Formatter ---
const formatDateTime = (timestamp: string | number | undefined) => {
    if (!timestamp) return "—";
    // Fix: replace space with "T" to handle "2026-07-06 14:41:20" format correctly
    const normalized = typeof timestamp === 'string' ? timestamp.replace(" ", "T") : timestamp;
    let date = new Date(normalized);

    if (isNaN(date.getTime()) && typeof timestamp === 'string' && /^\d+$/.test(timestamp)) {
        date = new Date(Number(timestamp));
    }
    if (isNaN(date.getTime())) return String(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;

    return `${day} ${month}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

export const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
    // ─── FINAL Data Extraction Engine ───
    const orderId = order.orderId || "N/A";
    const status = order.state || "NEW";

    // Summary Details
    const amount = order.amountExcludingDeliveryFee || 0;
    const items = order.orderItem || [];
   
    const totalQty = order.orderItem?.length || items.length;

    // Timestamps
    const timestamp = order.creationTime;

    // Customer Details
    const customerName = order.customerName || "—";
    const customerPhone = order.customerMobile || "—";
    const customerAddress = parseAddress(order.customerAddress);

    // Shop & Rider Details
    const shopName = order.shopDetails?.name || "Your Store";
    const shopAddr = order.shopDetails?.address;
    const shopAddressText = shopAddr
        ? [shopAddr.address, shopAddr.city, shopAddr.state, shopAddr.postalCode].filter(Boolean).join(", ")
        : "Pickup from registered store location.";
    const rider = order.deliveryPartnerDetails;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl bg-[#f8fafc] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ─── Header ─── */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
                    <div>
                        <p className="text-xs font-bold text-blue-800 mb-0.5 tracking-wider">#{orderId}</p>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Details</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* ─── Scrollable Body ─── */}
                <div className="overflow-y-auto p-6 space-y-5 custom-scrollbar">

                    {/* Top Row: Status, Amount, Created */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
                            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#1e40af]/10 text-[#1e40af] border border-[#1e40af]/20 uppercase tracking-wider">
                                {status}
                            </span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Amount</p>
                            <p className="text-base font-black text-slate-900">₹{amount}</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Created At</p>
                            <p className="text-sm font-bold text-slate-700">{formatDateTime(timestamp)}</p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-800">Items</h3>
                            <span className="text-xs font-semibold text-slate-500">{totalQty} total</span>
                        </div>
                        <div className="p-2 divide-y divide-slate-100 max-h-[220px] overflow-y-auto custom-scrollbar">
                            {items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">Item ID: #{item.id}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-800 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
                                        x{item.itemCount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Addresses: Pickup & Drop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Store size={14} className="text-[#1e40af]" />
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Shop : Pickup</h4>
                            </div>
                            <p className="text-sm font-black text-slate-900 mb-1">{shopName}</p>
                            <p className="text-[11px] text-slate-500 leading-relaxed mt-2 line-clamp-2">
                                {shopAddressText}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <User size={14} className="text-[#1e40af]" />
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Customer : Drop</h4>
                            </div>
                            <p className="text-sm font-black text-slate-900 mb-1">{customerName}</p>
                            <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-2">
                                <Phone size={10} /> {`+${customerPhone}`}
                            </p>
                            <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                                {customerAddress}
                            </p>
                        </div>
                    </div>

                    {/* Rider Section (Only shows if deliveryPartner details exist) */}
                    {rider && (
                        <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-md mt-4">
                            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <Navigation size={14} className="text-emerald-400" />
                                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Delivery Partner</h3>
                                </div>
                                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] font-bold uppercase tracking-wider rounded">
                                    Assigned
                                </span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600">
                                        <User className="text-slate-300" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{rider.name}</h4>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: {rider.id?.split('-')[0] || "—"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                                    <Phone size={12} className="text-emerald-400" />
                                    <span className="text-xs font-semibold text-slate-200">+{rider.mobileNumber || "—"}</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};