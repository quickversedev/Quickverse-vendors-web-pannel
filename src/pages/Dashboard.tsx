import { CheckCircle, FileClock, PlayCircle } from "lucide-react";
import { useEffect } from "react";
import { AcceptedOrderCard } from "../components/dashboard/AcceptedOrderCard";
import { OrderColumn } from "../components/dashboard/OrderColumn";
import { PendingOrderCard } from "../components/dashboard/PendingOrderCard";
import { ReadyOrderCard } from "../components/dashboard/ReadyOrderCard";
import { SummaryStatsRow } from "../components/dashboard/SummaryStatsRow";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useDashboardStore } from "../stores/useDashboardStore";
import { useOrderStore } from "../stores/useOrderStore"; // Legacy

const Dashboard = () => {
  const { pendingOrders, acceptedOrders, readyOrders, setInitialOrders } = useDashboardStore();
  const { incomingOrders } = useOrderStore(); // From legacy store
  const { allOrders } = useDashboardStats();

  useEffect(() => {
    if (allOrders) {
      setInitialOrders(allOrders);
    }
  }, [allOrders, setInitialOrders]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700">

      {/* 1. Summary Stats Row */}
      <SummaryStatsRow />

      {/* 2. Main 3-Column Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">

        {/* PENDING COLUMN */}
        <OrderColumn
          title="Pending Orders"
          count={pendingOrders.length}
          icon={<FileClock size={16} />}
          headerBgClass="bg-red-50 dark:bg-red-950/30 border-t-2 border-t-red-500"
          headerTextClass="text-red-700 dark:text-red-400"
          showBell={pendingOrders.length > 0}
        >
          {pendingOrders.map((order, idx) => (
            <PendingOrderCard key={order.orderId} order={order} sequence={idx + 1} />
          ))}
        </OrderColumn>

        {/* ACCEPTED COLUMN */}
        <OrderColumn
          title="Accepted Orders"
          count={acceptedOrders.length}
          icon={<PlayCircle size={16} />}
          headerBgClass="bg-amber-50 dark:bg-amber-950/30 border-t-2 border-t-amber-500"
          headerTextClass="text-amber-700 dark:text-amber-400"
        >
          {acceptedOrders.map((order, idx) => (
            <AcceptedOrderCard key={order.orderId} order={order} sequence={idx + 1} />
          ))}
        </OrderColumn>

        {/* READY FOR PICKUP COLUMN */}
        <OrderColumn
          title="Ready For Pickup"
          count={readyOrders.length}
          icon={<CheckCircle size={16} />}
          headerBgClass="bg-green-50 dark:bg-green-950/30 border-t-2 border-t-green-500"
          headerTextClass="text-green-700 dark:text-green-400"
        >
          {readyOrders.map((order, idx) => (
            <ReadyOrderCard key={order.orderId} order={order} sequence={idx + 1} />
          ))}
        </OrderColumn>

      </div>
    </div>
  );
};

export default Dashboard;
