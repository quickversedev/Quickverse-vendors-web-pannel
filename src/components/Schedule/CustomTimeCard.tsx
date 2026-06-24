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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl justify-between min-h-[340px]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-zinc-800 text-emerald-400 shrink-0 mt-0.5">
            <Clock size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Custom Time</h4>
            <p className="text-[11px] text-zinc-500">Set specific date & offline time range</p>
          </div>
        </div>
        
        {/* Date Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Date</label>
          <input
            type="date"
            required
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition cursor-pointer"
          />
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Start Time</label>
            <input 
              type="time" 
              required 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">End Time</label>
            <input 
              type="time" 
              required 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition" 
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving || !date} 
        className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
      >
        {isSaving && <Loader2 size={12} className="animate-spin" />} Save Custom Schedule
      </button>
    </form>
  );
};