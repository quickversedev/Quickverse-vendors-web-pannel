import { useState } from "react";
import toast from "react-hot-toast";
import { useConfigureVendorScheduleMutation } from "../apis/schedule";
import type { DayOfWeek, OperatingHours } from "../types/schedule";
import {useAuthStore} from '../stores/useAuthStore';


export const useSchedule = () => {

  const { shopId } = useAuthStore();
  // ─── UI Panel Display State ────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);

  // ─── RTK Query Mutation Hook ──────────────────────────────
  const [configureSchedule, { isLoading: isSaving }] = useConfigureVendorScheduleMutation();

  // Helper toggle function for the master layout button
  const toggleFormPanel = () => setIsFormOpen((prev) => !prev);

  // ─── Centralized Submit Pipeline ──────────────────────────
  const saveScheduleGrid = async (operatingHoursObj: OperatingHours) => {
    if (!shopId) {
      toast.error("Session expired. Shop ID missing.");
      return;
    }
    try {
      // Active Recall Guard: Transform clean JS object to escaped string payload
      const stringifiedHours = JSON.stringify(operatingHoursObj);

      await configureSchedule({
        shopId,
        manualOfflineOverride: false, // Driven strictly by calendar matrix tracking
        scheduleActive: true,         // Activating scheduling slots engine live
        operatingHours: stringifiedHours,
      }).unwrap(); // unwrap unlocks direct try/catch control over the network promise

      // Rule: Auto-close form panel on successful API completion
      toast.success("Schedule successfully deployed!");
      setIsFormOpen(false);
    } catch (error) {
      // Rule: Keep form open on failure so vendor inputs are preserved
      console.error("Schedule configuration error:", error);
      toast.error("Failed to save configuration. Please verify inputs.");
    }
  };

  // ─── Specific Formatting Handlers for the 3 Input Cards ───

  // 1. Custom Time Handler
  const handleCustomTimeSave = async (data: { date: string; startTime: string; endTime: string }) => {
    // Generate standard 7-day format structure where target day holds the custom slots
    const dayName = new Date(data.date).toLocaleDateString("en-US", { weekday: "short" }) as DayOfWeek;

    const operationalMatrix = {
      [dayName]: { openTime: data.startTime, closeTime: data.endTime }
    } as OperatingHours;

    await saveScheduleGrid(operationalMatrix);
  };

  // 2. All Day Closed Handler
  const handleAllDayClosedSave = async (data: { date: string }) => {
    const dayName = new Date(data.date).toLocaleDateString("en-US", { weekday: "short" }) as DayOfWeek;

    // Setting both pointers to "00:00" flags a standard full 24-hr system block
    const operationalMatrix = {
      [dayName]: { openTime: "00:00", closeTime: "00:00" }
    } as OperatingHours;

    await saveScheduleGrid(operationalMatrix);
  };

  // 3. Recurring Slots Handler
  const handleRecurringSave = async (data: { selectedDays: string[]; startDate: string; endDate?: string }) => {
    const operationalMatrix = {} as OperatingHours;

    // Distribute default lock times across every chosen target day row
    data.selectedDays.forEach((day) => {
      operationalMatrix[day as DayOfWeek] = { openTime: "09:00", closeTime: "21:00" };
    });

    await saveScheduleGrid(operationalMatrix);
  };

  return {
    isFormOpen,
    viewAllOpen,
    isSaving,
    toggleFormPanel,
    setViewAllOpen,
    handleCustomTimeSave,
    handleAllDayClosedSave,
    handleRecurringSave,
  };
};