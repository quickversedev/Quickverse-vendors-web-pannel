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
      // Send undefined if empty to prompt open-ended lifecycle loops in your hook
      endDate: endDate || undefined 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl justify-between min-h-[340px]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-zinc-800 text-emerald-400 shrink-0 mt-0.5">
            <RefreshCw size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">Recurring</h4>
            <p className="text-[11px] text-zinc-500">Repeat schedules across multiple weekdays</p>
          </div>
        </div>

        {/* Multi-Select Day Toggles */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Repeat on</label>
          <div className="flex flex-wrap gap-1.5">
            {DAYS_SHORT.map((day) => {
              const isActive = selectedDays.includes(day);
              return (
                <button
                  type="button" 
                  key={day} 
                  onClick={() => toggleDay(day)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition duration-150 ${
                    isActive 
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Boundaries */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Start Date</label>
            <input 
              type="date" 
              required 
              value={startDate} 
              min={new Date().toISOString().split("T")[0]} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg px-2 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition cursor-pointer" 
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">End Date</label>
              <span className="text-[9px] text-zinc-500 font-medium lowercase">Optional</span>
            </div>
            <input 
              type="date" 
              value={endDate} 
              // Active Recall: Safe date matching prevents ending before starting
              min={startDate || new Date().toISOString().split("T")[0]} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg px-2 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition cursor-pointer" 
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving || selectedDays.length === 0 || !startDate} 
        className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
      >
        {isSaving && <Loader2 size={12} className="animate-spin" />} Save Recurring Patterns
      </button>
    </form>
  );
};