import { useMemo } from 'react';
import { useGetVendorOrdersQuery } from '../apis/orderApi';
import { useGetDashboardStatsQuery } from '../apis/dashboardApi';
import { useAuthStore } from '../stores/useAuthStore';
import { useDashboardStore } from '../stores/useDashboardStore';

export const useDashboardStats = () => {
  const { shopId } = useAuthStore();
  const { pendingOrders, acceptedOrders, readyOrders } = useDashboardStore();

  // Try to fetch new stats API
  const { data: apiStats, isLoading: isApiLoading, refetch: refetchStats } = useGetDashboardStatsQuery(shopId ?? "", { skip: !shopId });

  // Fallback to local computation if backend hasn't implemented it yet
  const { data: allOrders, isLoading: isOrdersLoading, isFetching, refetch: refetchOrders } = useGetVendorOrdersQuery(
    { shopId: shopId ?? "" },
    { skip: !shopId }
  );
  
  const stats = useMemo(() => {
    // If backend provided stats, use them
    if (apiStats && Object.keys(apiStats).length > 0) {
      return {
        total: apiStats.totalOrdersToday || 0,
        pending: apiStats.pendingOrdersToday || 0,
        accepted: apiStats.acceptedOrdersToday || 0,
        ready: apiStats.readyOrdersToday || 0,
        avgAcceptanceTime: apiStats.avgAcceptanceTimeSec ? `${Math.floor(apiStats.avgAcceptanceTimeSec / 60)} min` : "0 min",
        avgPreparationTime: apiStats.avgPreparationTimeSec ? `${Math.floor(apiStats.avgPreparationTimeSec / 60)} min` : "0 min",
        revenue: `₹${(apiStats.revenueToday || 0).toLocaleString('en-IN')}`,
        completionRate: `${apiStats.completionRate || 0}%`,
      };
    }

    // Fallback local computation
    const defaultStats = { 
      total: 0, pending: 0, accepted: 0, ready: 0, 
      avgAcceptanceTime: "0 min", avgPreparationTime: "0 min", 
      revenue: "₹0", completionRate: "0%" 
    };
    
    if (!allOrders) return defaultStats;

    // Filter today's orders for fallback
    const today = new Date().toDateString();
    const todaysOrders = allOrders.filter(o => new Date(o.creationTime).toDateString() === today);

    const total = todaysOrders.length;
    
    // Mix live store counts with fallback
    const pendingCount = pendingOrders.length > 0 ? pendingOrders.length : todaysOrders.filter(o => o.state === "PENDING").length;
    const acceptedCount = acceptedOrders.length > 0 ? acceptedOrders.length : todaysOrders.filter(o => o.state === "ACCEPTED").length;
    const readyCount = readyOrders.length > 0 ? readyOrders.length : todaysOrders.filter(o => o.state === "READY_FOR_PICKUP").length;
    
    const completedOrders = todaysOrders.filter(o => o.state === "COMPLETED");
    const revenueSum = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const completionRate = total > 0 ? Math.round((completedOrders.length / total) * 100) : 0;

    return {
      total,
      pending: pendingCount,
      accepted: acceptedCount,
      ready: readyCount,
      avgAcceptanceTime: "0 min", // Mock until backend sends it
      avgPreparationTime: "0 min", // Mock until backend sends it
      revenue: `₹${revenueSum.toLocaleString('en-IN')}`,
      completionRate: `${completionRate}%`
    };
  }, [allOrders, apiStats, pendingOrders, acceptedOrders, readyOrders]);

  const refresh = () => {
    refetchStats();
    refetchOrders();
  };
  
  return { stats, isLoading: isApiLoading || isOrdersLoading || isFetching, refresh };
};
