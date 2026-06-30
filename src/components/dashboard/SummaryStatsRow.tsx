import { useDashboardStats } from "../../hooks/useDashboardStats";
import { ListOrdered, CheckCircle2, PackageCheck, Clock, CheckSquare } from "lucide-react";

export const SummaryStatsRow = () => {
  const { stats } = useDashboardStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      
      {/* 1. Total Orders Today */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400">
            <ListOrdered size={14} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Total Orders Today</p>
        </div>
        <p className="text-xl font-black text-slate-800 dark:text-zinc-100 pl-1">{stats.total}</p>
      </div>

      {/* 2. Pending Orders Today */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-zinc-800 text-rose-600 dark:text-rose-400">
            <CheckSquare size={14} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Pending Orders</p>
        </div>
        <p className="text-xl font-black text-slate-800 dark:text-zinc-100 pl-1">{stats.pending}</p>
      </div>

      {/* 3. Accepted Orders */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-zinc-800 text-amber-600 dark:text-amber-400">
            <CheckCircle2 size={14} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Accepted Orders</p>
        </div>
        <p className="text-xl font-black text-slate-800 dark:text-zinc-100 pl-1">{stats.accepted}</p>
      </div>

      {/* 4. Ready Orders */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400">
            <PackageCheck size={14} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Ready Orders</p>
        </div>
        <p className="text-xl font-black text-slate-800 dark:text-zinc-100 pl-1">{stats.ready}</p>
      </div>

      {/* 5. Avg Acceptance Time */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-zinc-800 text-purple-600 dark:text-purple-400">
            <Clock size={14} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Avg Accept Time</p>
        </div>
        <p className="text-xl font-black text-slate-800 dark:text-zinc-100 pl-1">{stats.avgAcceptanceTime}</p>
      </div>

      {/* 6. Avg Prep Time */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400">
            <Clock size={14} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">Avg Prep Time</p>
        </div>
        <p className="text-xl font-black text-slate-800 dark:text-zinc-100 pl-1">{stats.avgPreparationTime}</p>
      </div>

    </div>
  );
};
