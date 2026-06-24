
import React, { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";

interface RecurringCardProps {
  onSave: (data: { selectedDays: string[]; startDate: string; endDate?: string }) => Promise<void>;
  isSaving: boolean;
}

export const RecurringCard = ({ onSave, isSaving }: RecurringCardProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => 
      prev.includes(day) 
        ? prev.filter((d) => d !== day) 
        : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0 || !startDate) return;
    
    onSave({ 
      selectedDays, 
      startDate, 
      endDate: endDate || undefined 
    });
  };

  const inputClasses = "w-full bg-[#131316] border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs text-zinc-100 shadow-inner focus:outline-none focus:border-emerald-500/80 focus:ring-4 focus:ring-emerald-500/15 transition-all duration-200 [color-scheme:dark]";
  const cardClasses = "flex flex-col bg-[#18181b] border border-zinc-700/60 rounded-2xl p-5 shadow-[0_8px_30px_rgba(255,255,255,0.04)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.07)] transition-all duration-300 justify-between min-h-[340px]";
  const btnClasses = "w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800/80 disabled:text-zinc-400 disabled:border disabled:border-zinc-700/80 disabled:shadow-none text-zinc-950 text-xs font-extrabold tracking-wide rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]";

  return (
    <form onSubmit={handleSubmit} className={cardClasses}>
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/60 text-emerald-400 shrink-0 shadow-sm">
            <RefreshCw size={16} />
          </div>
          <div className="pt-0.5">
            <h4 className="text-sm font-bold text-zinc-100 tracking-wide">Recurring</h4>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Repeat schedules across multiple weekdays</p>
          </div>
        </div>

        {/* Premium Multi-Select Day Grid */}
        <div className="space-y-2">
          <div className="flex items-center h-[18px] pl-1">
            <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Repeat on</label>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS_SHORT.map((day) => {
              const isActive = selectedDays.includes(day);
              return (
                <button
                  type="button" 
                  key={day} 
                  onClick={() => toggleDay(day)}
                  className={`flex items-center justify-center h-9 rounded-xl border text-[10px] font-bold transition-all duration-200 ${
                    isActive 
                      ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.15)]" 
                      : "bg-[#131316] border-zinc-700/80 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* PERFECTLY ALIGNED Date Boundaries */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center h-[18px] pl-1">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Start Date</label>
            </div>
            <input 
              type="date" 
              required 
              value={startDate} 
              min={new Date().toISOString().split("T")[0]} 
              onChange={(e) => setStartDate(e.target.value)} 
              className={`${inputClasses} cursor-pointer`} 
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center h-[18px] pl-1">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">End Date</label>
              <span className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase">Opt</span>
            </div>
            <input 
              type="date" 
              value={endDate} 
              min={startDate || new Date().toISOString().split("T")[0]} 
              onChange={(e) => setEndDate(e.target.value)} 
              className={`${inputClasses} cursor-pointer`} 
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={isSaving || selectedDays.length === 0 || !startDate} className={btnClasses}>
        {isSaving && <Loader2 size={14} className="animate-spin" />} 
        Save Recurring Patterns
      </button>
    </form>
  );
};