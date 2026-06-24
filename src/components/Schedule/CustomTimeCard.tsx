
import React, { useState } from "react";
import { Clock, Loader2 } from "lucide-react";

interface CustomTimeCardProps {
  onSave: (data: { date: string; startTime: string; endTime: string }) => Promise<void>;
  isSaving: boolean;
}

export const CustomTimeCard = ({ onSave, isSaving }: CustomTimeCardProps) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("22:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    onSave({ date, startTime, endTime });
  };

  // Premium reusable styling variables
  const inputClasses = "w-full bg-[#131316] border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs text-zinc-100 shadow-inner focus:outline-none focus:border-emerald-500/80 focus:ring-4 focus:ring-emerald-500/15 transition-all duration-200 [color-scheme:dark]";
  const cardClasses = "flex flex-col bg-[#18181b] border border-zinc-700/60 rounded-2xl p-5 shadow-[0_8px_30px_rgba(255,255,255,0.04)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.07)] transition-all duration-300 justify-between min-h-[340px]";
  const btnClasses = "w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800/80 disabled:text-zinc-400 disabled:border disabled:border-zinc-700/80 disabled:shadow-none text-zinc-950 text-xs font-extrabold tracking-wide rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]";

  return (
    <form onSubmit={handleSubmit} className={cardClasses}>
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/60 text-emerald-400 shrink-0 shadow-sm">
            <Clock size={16} />
          </div>
          <div className="pt-0.5">
            <h4 className="text-sm font-bold text-zinc-100 tracking-wide">Custom Time</h4>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Set specific date & offline time range</p>
          </div>
        </div>
        
        {/* Date Input */}
        <div className="space-y-2">
          <div className="flex items-center h-[18px] pl-1">
            <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Target Date</label>
          </div>
          <input
            type="date"
            required
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClasses} cursor-pointer`}
          />
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center h-[18px] pl-1">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Start Time</label>
            </div>
            <input 
              type="time" 
              required 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              className={inputClasses} 
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center h-[18px] pl-1">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">End Time</label>
            </div>
            <input 
              type="time" 
              required 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              className={inputClasses} 
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={isSaving || !date} className={btnClasses}>
        {isSaving && <Loader2 size={14} className="animate-spin" />} 
        Save Custom Schedule
      </button>
    </form>
  );
};