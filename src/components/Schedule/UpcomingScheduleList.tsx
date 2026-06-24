import React from "react";
import { Calendar, Clock, Layers, ArrowRight, X } from "lucide-react";
import type { OperatingHours, DayOfWeek } from "../../types/schedule";

interface UpcomingSchedulesListProps {
  operatingHours: OperatingHours;
  onViewAllClick: () => void;
}

// Helper utility to turn military time "21:00" into readable professional UI tokens "09:00 PM"
const format12Hour = (timeStr: string): string => {
  if (!timeStr) return "—";
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, "0")}:${minutesStr} ${ampm}`;
};

export const UpcomingSchedulesList = ({ operatingHours, onViewAllClick }: UpcomingSchedulesListProps) => {
  // Convert our active map object into iterable ordered rows
  const activeSchedules = Object.entries(operatingHours)
    .filter(([_, slot]) => slot.openTime && slot.closeTime)
    .map(([day, slot]) => ({
      day: day as DayOfWeek,
      ...slot,
    }));

  // ─── Requirement Check: Empty State ──────────────────────────
  if (activeSchedules.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <p className="text-zinc-400 font-semibold text-sm">No upcoming schedules found 😐</p>
        <p className="text-zinc-600 text-[11px] mt-0.5">Your store is running on standard automatic tracking rules.</p>
      </div>
    );
  }

  // Requirement Check: Slice display arrays to a maximum height density threshold of 4 lines
  const visibleSchedules = activeSchedules.slice(0, 4);
  const hasMoreThanFour = activeSchedules.length > 4;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden flex flex-col justify-between min-h-[300px]">
      <div>
        {/* Module Header Container */}
        <div className="px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <h3 className="text-sm font-semibold text-zinc-200">Upcoming Offline Schedule</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Live monitoring view of active operational constraint boundaries.</p>
        </div>

        {/* Dynamic Mapping Matrix rows */}
        <div className="divide-y divide-zinc-800/50 px-5">
          {visibleSchedules.map((schedule) => {
            const isAllDayBlock = schedule.openTime === "00:00" && schedule.closeTime === "00:00";
            
            return (
              <div key={schedule.day} className="grid grid-cols-3 py-3.5 items-center text-xs">
                {/* COLUMN 1: Type / Variant Identification Token */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded-md shrink-0 ${isAllDayBlock ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                    {isAllDayBlock ? <Layers size={13} /> : <Clock size={13} />}
                  </div>
                  <span className="font-medium text-zinc-300 truncate">
                    {isAllDayBlock ? "Full Closure" : "Shift Override"}
                  </span>
                </div>

                {/* COLUMN 2: Target Range Values */}
                <div className="text-zinc-400 font-medium">
                  {isAllDayBlock ? (
                    <span className="px-2 py-0.5 rounded bg-zinc-950 text-rose-400/90 text-[10px] font-bold border border-rose-500/15 uppercase">
                      All Day
                    </span>
                  ) : (
                    <span className="font-mono text-zinc-300">
                      {format12Hour(schedule.openTime)} - {format12Hour(schedule.closeTime)}
                    </span>
                  )}
                </div>

                {/* COLUMN 3: Target Timelines / Days */}
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 font-bold text-[10px] uppercase tracking-wider">
                    {schedule.day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COLUMN SEPARATION OVERFLOW TRUNCATION ACTION LINK BUTTON */}
      {hasMoreThanFour && (
        <div className="p-3 bg-zinc-900/60 border-t border-zinc-800/50 flex justify-center">
          <button
            onClick={onViewAllClick}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
          >
            View all schedules <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};