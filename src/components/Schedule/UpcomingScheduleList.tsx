import React, { useState } from "react";
import { Edit2, Trash2, ArrowRight, ChevronUp } from "lucide-react";
import type { OperatingHours, DayOfWeek } from "../../types/schedule";

interface UpcomingSchedulesListProps {
  operatingHours: OperatingHours;
  onEditClick: (day: DayOfWeek) => void;
  onDeleteClick: (day: DayOfWeek) => void;
}

// Time formatter (09:00 -> 09:00 AM)
const format12Hour = (timeStr: string): string => {
  if (!timeStr) return "—";
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, "0")}:${minutesStr} ${ampm}`;
};

// Full day name mapper
const FULL_DAY_NAMES: Record<string, string> = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday"
};

export const UpcomingSchedulesList = ({ operatingHours, onEditClick, onDeleteClick }: UpcomingSchedulesListProps) => {
  // ─── 1. State for Inline Modal-Free Expansion ──────────────────
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter only active days
  const activeSchedules = Object.entries(operatingHours)
    .filter(([_, slot]) => slot.openTime && slot.closeTime)
    .map(([day, slot]) => ({
      day: day as DayOfWeek,
      ...slot,
    }));

  // Empty State
  if (activeSchedules.length === 0) {
    return (
      <div className="bg-[#18181b] border border-zinc-700/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgba(255,255,255,0.04)]">
        <p className="text-zinc-400 font-semibold text-sm">No active schedules configured 😐</p>
        <p className="text-zinc-600 text-[11px] mt-0.5">Your store is running on standard automatic tracking rules.</p>
      </div>
    );
  }

  // Slicing logic for expand/collapse
  const hasMoreThanFour = activeSchedules.length > 4;
  const visibleSchedules = isExpanded ? activeSchedules : activeSchedules.slice(0, 4);

  return (
    <div className="bg-[#18181b] border border-zinc-700/60 rounded-2xl shadow-[0_8px_30px_rgba(255,255,255,0.04)] overflow-hidden flex flex-col transition-all duration-300">
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
        <h3 className="text-[15px] font-bold text-zinc-100 tracking-wide">Shop Schedule Overview</h3>
        <p className="text-xs text-zinc-400 font-medium mt-0.5">Live monitoring view of active operational constraint boundaries.</p>
      </div>

      {/* Scrollable Container (Expands inline instead of opening a modal) */}
      <div className={`divide-y divide-zinc-800/50 px-5 transition-all duration-300 ${isExpanded ? "max-h-[300px] overflow-y-auto" : ""}`}>
        {visibleSchedules.map((schedule) => {
          const isAllDayBlock = schedule.openTime === "00:00" && schedule.closeTime === "00:00";
          
          return (
            <div key={schedule.day} className="flex items-center justify-between py-4 group">
              
              {/* Left Side: Day & Time Info */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-200">{FULL_DAY_NAMES[schedule.day]}:</span>
                <span className="text-sm text-zinc-400 font-medium">
                  {isAllDayBlock 
                    ? "All Day Closure" 
                    : `${format12Hour(schedule.openTime)} - ${format12Hour(schedule.closeTime)} (Recurring)`}
                </span>
              </div>

              {/* Right Side: Edit & Delete Actions (Premium Hover Reveal) */}
              <div className="flex items-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  onClick={() => onEditClick(schedule.day)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all text-[11px] font-bold tracking-wide active:scale-95"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button 
                  onClick={() => onDeleteClick(schedule.day)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:text-rose-400 hover:border-rose-500/50 transition-all text-[11px] font-bold tracking-wide active:scale-95"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Expand/Collapse Button (Replaces Modal Trigger) */}
      {hasMoreThanFour && (
        <div className="p-3 bg-zinc-900/40 border-t border-zinc-800/80 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-emerald-500/10"
          >
            {isExpanded ? (
              <>Collapse view <ChevronUp size={14} /></>
            ) : (
              <>View all schedules <ArrowRight size={14} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
};