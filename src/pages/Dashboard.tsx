import { CheckCircle, FileClock, PlayCircle, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useGetVendorOrdersQuery } from "../apis/orderApi";
import { AcceptedOrderCard } from "../components/dashboard/AcceptedOrderCard";
import { OrderColumn } from "../components/dashboard/OrderColumn";
import { PendingOrderCard } from "../components/dashboard/PendingOrderCard";
import { ReadyOrderCard } from "../components/dashboard/ReadyOrderCard";
import { SummaryStatsRow } from "../components/dashboard/SummaryStatsRow";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useDashboardStore } from "../stores/useDashboardStore";
import type { OrderActionEvent } from "../types/order";

import { OrderDetailsModal } from "../components/common/OrderDetailsModal";

const Dashboard = () => {
  const { shopId } = useAuthStore();
  const { pendingOrders, acceptedOrders, readyOrders, setInitialOrders } = useDashboardStore();
  
  // ─── 1. FETCH STATS ───
  const { isFetching, refresh } = useDashboardStats(); 

  // ─── 2. FETCH INITIAL ORDERS FOR KANBAN ───
  const { data: allOrders } = useGetVendorOrdersQuery(
    { shopId: shopId ?? "" },
    {
      skip: !shopId,
      pollingInterval: 45000,          // ← Auto-refresh every 45 seconds
      refetchOnMountOrArgChange: true, // ← Re-fetch on page revisit
    }
  );

  const [viewOrder, setViewOrder] = useState<OrderActionEvent | null>(null);

  // Populate Kanban columns on initial load
  useEffect(() => {
    if (allOrders) {
      setInitialOrders(allOrders);
    }
  }, [allOrders, setInitialOrders]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700">

      {/* ─── NEW: LIVE WORKSPACE HEADER WITH REFRESH BUTTON ─── */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-black text-slate-800 dark:text-zinc-100 tracking-tight">
          Live Workspace
        </h1>
        
        <button
          onClick={refresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw size={14} className={isFetching ? "animate-spin text-blue-500" : ""} />
          {isFetching ? "Syncing..." : "Refresh Stats"}
        </button>
      </div>

      {/* 1. Summary Stats Row */}
      <SummaryStatsRow />

      {/* 2. Main 3-Column Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">

        {/* PENDING COLUMN */}
        <OrderColumn
          title="Pending Orders"
          count={pendingOrders.length}
          icon={<FileClock size={16} />}
          headerBgClass="bg-red-50 dark:bg-red-950/30 border-t-2 border-t-red-500"
          headerTextClass="text-red-700 dark:text-red-400"
          showBell={pendingOrders.length > 0}
        >
          {pendingOrders.map((order, idx) => (
            <PendingOrderCard 
              key={order.orderId}
              order={order}
              sequence={idx + 1}
              onViewDetails={() => setViewOrder(order)} 
            />
          ))}
        </OrderColumn>

        {/* ACCEPTED COLUMN */}
        <OrderColumn
          title="Accepted Orders"
          count={acceptedOrders.length}
          icon={<PlayCircle size={16} />}
          headerBgClass="bg-amber-50 dark:bg-amber-950/30 border-t-2 border-t-amber-500"
          headerTextClass="text-amber-700 dark:text-amber-400"
        >
          {acceptedOrders.map((order, idx) => (
            <AcceptedOrderCard 
              key={order.orderId}
              order={order}
              sequence={idx + 1}
              onViewDetails={() => setViewOrder(order)}
            />
          ))}
        </OrderColumn>

        {/* READY FOR PICKUP COLUMN */}
        <OrderColumn
          title="Ready For Pickup"
          count={readyOrders.length}
          icon={<CheckCircle size={16} />}
          headerBgClass="bg-green-50 dark:bg-green-950/30 border-t-2 border-t-green-500"
          headerTextClass="text-green-700 dark:text-green-400"
        >
          {readyOrders.map((order, idx) => (
            <ReadyOrderCard 
              key={order.orderId}
              order={order}
              sequence={idx + 1}
              onViewDetails={() => setViewOrder(order)}
            />
          ))}
        </OrderColumn>

      </div>
      
      {/* ─── 3. RENDER HOISTED MODAL ─── */}
      {viewOrder && (
        <OrderDetailsModal 
          order={viewOrder} 
          onClose={() => setViewOrder(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;