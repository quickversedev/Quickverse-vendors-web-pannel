import React from "react";
import { X, Layers, Clock } from "lucide-react";
import type { OperatingHours, DayOfWeek } from "../../types/schedule";

interface ViewAllSchedulesModalProps {
  operatingHours: OperatingHours;
  onClose: () => void;
}

const format12Hour = (timeStr: string): string => {
  if (!timeStr) return "—";
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, "0")}:${minutesStr} ${ampm}`;
};

export const ViewAllSchedulesModal = ({ operatingHours, onClose }: ViewAllSchedulesModalProps) => {
  const activeSchedules = Object.entries(operatingHours)
    .filter(([_, slot]) => slot.openTime && slot.closeTime)
    .map(([day, slot]) => ({ day: day as DayOfWeek, ...slot }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">All Scheduled Configurations</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Complete system operational map registry breakdown.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable Schedule List Content */}
        <div className="p-5 max-h-[350px] overflow-y-auto space-y-2.5 divide-y divide-zinc-800/30">
          {activeSchedules.map((schedule) => {
            const isAllDayBlock = schedule.openTime === "00:00" && schedule.closeTime === "00:00";
            return (
              <div key={schedule.day} className="grid grid-cols-3 items-center text-xs pt-2.5 first:pt-0">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${isAllDayBlock ? "text-rose-400" : "text-emerald-400"}`}>
                    {isAllDayBlock ? <Layers size={12} /> : <Clock size={12} />}
                  </div>
                  <span className="font-semibold text-zinc-300">{schedule.day}</span>
                </div>
                
                <div className="col-span-2 text-right font-mono text-zinc-400">
                  {isAllDayBlock ? (
                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/5 border border-rose-500/10 px-1.5 py-0.5 rounded">
                      CLOSED ALL DAY
                    </span>
                  ) : (
                    `${format12Hour(schedule.openTime)} - ${format12Hour(schedule.closeTime)}`
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Area */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/40 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded-lg transition"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};