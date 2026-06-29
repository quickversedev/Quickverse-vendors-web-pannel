import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { OrderStatusFilter, TimeFilterOption } from "../../types/filters";

// ─── Constants ──────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Accepted", value: OrderStatusFilter.ACCEPTED },
  { label: "Rejected", value: OrderStatusFilter.REJECTED },
  { label: "Completed", value: OrderStatusFilter.COMPLETED },
  { label: "Cancelled", value: OrderStatusFilter.CANCELLED },
];

const TIME_OPTIONS = [
  { label: "Last 30 min", value: TimeFilterOption.LAST_30_MIN },
  { label: "Today", value: TimeFilterOption.TODAY },
  { label: "Last Week", value: TimeFilterOption.LAST_WEEK },
  { label: "Monthly", value: TimeFilterOption.THIS_MONTH },
  { label: "Yearly", value: TimeFilterOption.THIS_YEAR },
];

// ─── Props ──────────────────────────────────────────────────────
interface FilterBarProps {
  statusFilter: string;
  timeFilter: string;
  customStartDate: Date | null;
  customEndDate: Date | null;
  onStatusChange: (status: string) => void;
  onTimeChange: (time: string) => void;
  onCustomDateChange: (start: Date | null, end: Date | null) => void;
}

// ─── Component ──────────────────────────────────────────────────
const FilterBar = ({
  statusFilter,
  timeFilter,
  customStartDate,
  customEndDate,
  onStatusChange,
  onTimeChange,
  onCustomDateChange,
}: FilterBarProps) => {

  // Shared pill button classes
  const pillBase =
    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border";
  const pillActive =
    "bg-[#1e40af] text-white border-[#1e40af] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100";
  const pillInactive =
    "bg-transparent text-slate-500 border-slate-300 hover:border-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-zinc-200";

 

  return (
    <div className="space-y-3">
      {/* ─── Row 1: Status Filter Pills ──────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-500 mr-1">Status:</span>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={`${pillBase} ${statusFilter === opt.value ? pillActive : pillInactive
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ─── Row 2: Time Filter Pills + Dropdowns + DatePicker ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-zinc-500 mr-1">Time:</span>

        {/* Quick time pills */}
        {TIME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTimeChange(opt.value)}
            className={`${pillBase} ${timeFilter === opt.value ? pillActive : pillInactive
              }`}
          >
            {opt.label}
          </button>
        ))}



        {/* Custom date range button + pickers */}
        <button
          onClick={() => onTimeChange("CUSTOM")}
          className={`${pillBase} ${timeFilter === "CUSTOM" ? pillActive : pillInactive
            }`}
        >
          Custom
        </button>

        {timeFilter === "CUSTOM" && (
          <div className="flex items-center gap-2">
            <DatePicker
              selected={customStartDate}
              onChange={(date: Date | null) => onCustomDateChange(date, customEndDate)}
              placeholderText="From date"
              dateFormat="dd MMM yyyy"
              maxDate={customEndDate || new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"

              className="bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs rounded-lg px-3 py-1.5 border border-slate-300 dark:border-zinc-700 outline-none w-32 focus:border-[#1e40af] dark:focus:border-zinc-500"
            />
            <span className="text-slate-400 dark:text-zinc-600 text-xs">→</span>
            <DatePicker
              selected={customEndDate}
              onChange={(date: Date | null) => onCustomDateChange(customStartDate, date)}
              placeholderText="To date"
              dateFormat="dd MMM yyyy"
              minDate={customStartDate || undefined}
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"

              className="bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs rounded-lg px-3 py-1.5 border border-slate-300 dark:border-zinc-700 outline-none w-32 focus:border-[#1e40af] dark:focus:border-zinc-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
