
import { Bell, CalendarPlus, Loader2, Info } from "lucide-react";
import { useGetVendorScheduleQuery } from "../apis/schedule";
import { useSchedule } from "../hooks/useSchedule";

import { CustomTimeCard } from "../components/Schedule/CustomTimeCard";
import { AllDayClosedCard } from "../components/Schedule/AllDayClosedCard";
import { RecurringCard } from "../components/Schedule/RecurringCard";
import { UpcomingSchedulesList } from "../components/Schedule/UpcomingScheduleList";
import { ViewAllSchedulesModal } from "../components/Schedule/ViewAllSchedulesModal";
import { useAuthStore } from "../stores/useAuthStore";


export const StoreSchedulePage = () => {
  const { shopId } = useAuthStore();

  const { data: scheduleData, isLoading } = useGetVendorScheduleQuery(shopId || "", { skip: !shopId });

  // ─── 2. Injecting Hook Layer ──────────────────────────
  const {
    isFormOpen,
    viewAllOpen,
    isSaving,
    toggleFormPanel,
    setViewAllOpen,
    handleCustomTimeSave,
    handleAllDayClosedSave,
    handleRecurringSave,
  } = useSchedule();

  // ─── 3. Response Evaluation & Status Logic ──────────────────
  const operatingHours = scheduleData?.operatingHoursJson
    ? JSON.parse(scheduleData.operatingHoursJson)
    : {};

  // Check if any active offline schedules exist
  const hasActiveSchedules = Object.values(operatingHours).some(
    (slot: any) => slot.openTime && slot.closeTime
  );

  // Master visual status flag (Read-Only)
  const isShopOnline = !hasActiveSchedules;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500 bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500 mb-2" size={24} />
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Syncing Store Matrix...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 space-y-6">

      {/* ─── ROW 1: HEADER & NOTIFICATION BELL ─────────────────── */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">Shop Status</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor real-time shop visibility metrics and manage schedule operations.
          </p>
        </div>

        <div className="relative p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 transition cursor-help group">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-zinc-900 animate-pulse" />

        </div>
      </div>

      {/* ─── ROW 2: REAL-TIME DISPLAY STATUS ENGINE ───────────── */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-zinc-200">Current Shop Status</h3>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <Info size={12} className="text-zinc-600 shrink-0" />
              Show real time current shop status.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800/60 select-none">
            <div className={`w-2 h-2 rounded-full ${isShopOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${isShopOnline ? "text-emerald-400" : "text-rose-400"}`}>
              {isShopOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <button
          onClick={toggleFormPanel}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] ${isFormOpen
              ? "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
            }`}
        >
          <CalendarPlus size={14} />
          {isFormOpen ? "Close Scheduler" : "Add Offline Schedule"}
        </button>
      </div>

      {/* ─── ROW 3: UPCOMING INTERVAL MONITOR ROWS ───────────── */}
      <UpcomingSchedulesList
        operatingHours={operatingHours}
        onViewAllClick={() => setViewAllOpen(true)}
      />
      {/* ─── ROW 4: EXTERNAL INPUT FORMS MATRIX ────────────────── */}
      {isFormOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4 duration-200">
          <CustomTimeCard onSave={handleCustomTimeSave} isSaving={isSaving} />
          <AllDayClosedCard onSave={handleAllDayClosedSave} isSaving={isSaving} />
          <RecurringCard onSave={handleRecurringSave} isSaving={isSaving} />
        </div>
      )}

      {/* ─── ROW 5: DETAILED ALL-RECORDS OVERLAY MODAL ────────── */}
      {viewAllOpen && (
        <ViewAllSchedulesModal
          operatingHours={operatingHours}
          onClose={() => setViewAllOpen(false)}
        />
      )}

    </div>
  );
};

export default StoreSchedulePage;