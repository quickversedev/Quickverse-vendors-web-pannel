import { useAuthStore } from "../stores/useAuthStore";
import { Store, Circle, Clock } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useEffect, useState } from "react";

const Navbar = () => {
  const shopId = useAuthStore((state) => state.shopId);
  const { stats } = useDashboardStats();
  
  // Real-time clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="flex h-[8%] min-h-[72px] items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-6 bg-white dark:bg-zinc-900 rounded-t-xl">
      
      {/* Left: Vendor Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Store className="text-slate-500 dark:text-zinc-400" size={20} />
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100">
            {/* TODO: Get actual vendor name if available, for now hardcode generic or shopId */}
            Vendor Store #{shopId || "1"}
          </h2>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20">
          <Circle className="fill-emerald-500 text-emerald-500 animate-pulse" size={8} />
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
            Online
          </span>
        </div>
      </div>

      {/* Right: Stats & Time */}
      <div className="flex items-center gap-6">
        
        {/* Current Time */}
        <div className="flex items-center gap-2 pr-6 border-r border-slate-200 dark:border-zinc-800">
          <Clock className="text-slate-400 dark:text-zinc-500" size={18} />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{formatTime(time)}</span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-500">{formatDate(time)}</span>
          </div>
        </div>

        {/* Header Stats */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Orders Today</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.total}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Revenue Today</span>
            <span className="text-sm font-bold text-[#1e40af] dark:text-emerald-400">{stats.revenue}</span>
          </div>
         
        </div>
        
      </div>
    </header>
  );
};

export default Navbar;