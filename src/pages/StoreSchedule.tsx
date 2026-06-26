import React, { useEffect, useState } from "react";
import { Bell, CalendarPlus, Loader2, Info, AlertCircle, CheckCircle2 } from "lucide-react";

import { useGetVendorScheduleQuery } from "../apis/schedule";
import { useSchedule } from "../hooks/useSchedule";
import { useAuthStore } from "../stores/useAuthStore";
import type { DayOfWeek } from "../types/schedule";

import { WeeklyScheduleCard } from "../components/Schedule/WeeklyScheduleCard";
import { UpcomingSchedulesList } from "../components/Schedule/UpcomingScheduleList";


const checkIsCurrentlyOfflineBySchedule = (operatingHours: any): boolean => {
  const now = new Date();
  const days: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = days[now.getDay()]; // Get today's actual day (e.g., "Tue")
  
  const todaysSchedule = operatingHours[currentDay];
  
  // If no schedule exists for today, the shop is ONLINE
  if (!todaysSchedule) return false; 

  // If it is a 24-hour closure, the shop is OFFLINE
  if (todaysSchedule.openTime === "00:00" && todaysSchedule.closeTime === "00:00") {
    return true;
  }

  // If there are specific times, compare them with the real-time clock
  const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const start = todaysSchedule.openTime;
  const end = todaysSchedule.closeTime;

  // Handles normal hours (09:00 to 22:00) and midnight crossover hours (22:00 to 02:00)
  if (start <= end) {
    return currentTimeStr >= start && currentTimeStr <= end;
  } else {
    return currentTimeStr >= start || currentTimeStr <= end;
  }
};

export const StoreSchedulePage = () => {
  const { shopId } = useAuthStore();

  const { data: scheduleData, isLoading } = useGetVendorScheduleQuery(shopId || "", {
    skip: !shopId
  });

  const {
    isFormOpen,
    isSaving,
    isToggling,
    feedback,
    toggleFormPanel,
    saveScheduleGrid,
    handleToggleStoreStatus,
    handleDeleteDay,
  } = useSchedule(); 

  const operatingHours = scheduleData?.operatingHoursJson
    ? JSON.parse(scheduleData.operatingHoursJson)
    : {};


  const isOfflineByClock = checkIsCurrentlyOfflineBySchedule(operatingHours);
  const isShopOnline = scheduleData?.manualOfflineOverride ? false : !isOfflineByClock;

  const handleEditClick = (day: DayOfWeek) => {
    if (!isFormOpen) toggleFormPanel();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (day: DayOfWeek) => {
    handleDeleteDay(day, operatingHours);
  };

  if (isLoading || !shopId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500 bg-[#09090b]">
        <Loader2 className="animate-spin text-emerald-500 mb-2" size={24} />
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {!shopId ? "Verifying Vendor..." : "Syncing Store Matrix..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 space-y-6">

      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">Store Status</h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-medium">
            Monitor real-time shop visibility metrics and manage schedule operations.
          </p>
        </div>

        <div className="relative p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 transition cursor-help group shadow-sm">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-zinc-900 animate-pulse" />
        </div>
      </div>

      <div className="p-5 bg-[#18181b] border border-zinc-700/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_8px_30px_rgba(255,255,255,0.03)]">
        <div className="flex items-center gap-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-200 tracking-wide">Current Shop Status</h3>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-medium">
              <Info size={12} className="text-zinc-600 shrink-0" />
              Toggle to manually override schedules and force your store online/offline.
            </p>
          </div>

          <button
            onClick={() => handleToggleStoreStatus(isShopOnline)}
            disabled={isToggling}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 active:scale-95 ${
              isToggling ? "opacity-50 cursor-not-allowed" : ""
            } ${
              isShopOnline 
                ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60" 
                : "bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60"
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${isShopOnline ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"}`} />
            <span className={`text-[11px] font-bold uppercase tracking-widest pr-1 ${isShopOnline ? "text-emerald-400" : "text-rose-400"}`}>
              {isToggling ? "Updating..." : isShopOnline ? "Online" : "Offline"}
            </span>
          </button>
        </div>

        <button
          onClick={toggleFormPanel}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98] ${
            isFormOpen
              ? "bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              : "bg-zinc-100 text-zinc-900 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          }`}
        >
          <CalendarPlus size={14} />
          {isFormOpen ? "Close Scheduler" : "Add Offline Schedule"}
        </button>
      </div>

     {feedback && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
          feedback.type === 'success' 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
        }`}>
          {/* Dynamically swap icons based on state */}
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : 
           feedback.type === 'offline' ? <Info size={18} /> : 
           <AlertCircle size={18} />}
           
          <span className="text-xs font-bold tracking-wide">{feedback.message}</span>
        </div>
      )}

      {isFormOpen && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
          <WeeklyScheduleCard 
            key={scheduleData?.updatedAt || "form"} 
            initialData={operatingHours} 
            onSave={saveScheduleGrid} 
            isSaving={isSaving} 
          />
        </div>
      )}

      <UpcomingSchedulesList
        operatingHours={operatingHours}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

    </div>
  );
};

export default StoreSchedulePage;