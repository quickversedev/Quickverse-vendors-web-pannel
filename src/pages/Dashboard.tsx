import { StatCard } from "../components/cards/StatCard";
import { IncomingOrderCard } from "../components/cards/IncomingOrderCard";
import { useOrderStore } from "../stores/useOrderStore";
import { Inbox, RotateCw } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";

const Dashboard = () => {
  const { incomingOrders } = useOrderStore();
  const { stats, isLoading, refresh } = useDashboardStats();


  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Stats Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-zinc-400">Welcome to QuickVerse dashboard.</p>

        <button
          onClick={() => refresh()}
          disabled={isLoading}
          className={`p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 ${isLoading ? 'animate-spin' : ''}`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats.total} />
        <StatCard title="Total Revenue" value={stats.revenue} />
        <StatCard title="Accepted Orders" value={stats.accepted} />
        <StatCard title="Rejected Orders" value={stats.rejected} />
      </div>

      {/* New Incoming Orders Section */}
      <div className="bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 min-h-[500px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            New Incoming Orders
            {incomingOrders.length > 0 && (
              <span className="bg-[#1e40af] dark:bg-emerald-500 text-white dark:text-zinc-950 text-xs px-2 py-1 rounded-full">
                {incomingOrders.length}
              </span>
            )}
          </h2>
        </div>

        {incomingOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomingOrders.map((order) => (
              <IncomingOrderCard key={order.orderId} order={order} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 dark:text-zinc-500">
            <div className="bg-slate-100 dark:bg-zinc-800/30 p-8 rounded-full mb-6">
              <Inbox className="w-16 h-16 opacity-20" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 dark:text-zinc-300">No new incoming orders</h3>
            <p className="text-sm mt-2">We'll notify you as soon as a new order arrives! 😊</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
