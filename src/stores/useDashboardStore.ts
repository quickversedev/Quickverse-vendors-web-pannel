import { create } from 'zustand';
import type { OrderActionEvent } from '../types/order';

interface DashboardState {
  pendingOrders: OrderActionEvent[];
  acceptedOrders: OrderActionEvent[];
  readyOrders: OrderActionEvent[];
  
  // Actions
  addPendingOrder: (order: OrderActionEvent) => void;
  setInitialOrders: (orders: any[]) => void;
  updateOrder: (orderId: string, updates: Partial<OrderActionEvent>) => void;
  moveToAccepted: (orderId: string, preparationTime: number) => void;
  moveToReady: (orderId: string) => void;
  removeOrder: (orderId: string) => void;
  clearAll: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  pendingOrders: [],
  acceptedOrders: [],
  readyOrders: [],

  setInitialOrders: (orders) => set(() => {
    const mapped: OrderActionEvent[] = orders.map((o: any) => ({
      orderId: o.orderId,
      totalOrderAmount: String(o.totalAmount ?? o.totalOrderAmount ?? ""),
      totalQuantity: String(o.totalItemCount ?? o.totalQuantity ?? ""),
      orderDescription: o.orderDescription || "",
      orderItems: o.orderItem || o.orderItems || [],
      customerName: o.customerName || "",
      customerPhone: String(o.customerMobile ?? o.customerPhone ?? ""),
      customerAddress: o.customerAddress || "",
      id: String(o.shopId ?? o.id ?? ""),
      status: o.state || o.status || "",
      message: o.message || "",
      createdAt: o.creationTime || o.createdAt || new Date().toISOString(),
      createdBy: String(o.customerId ?? o.createdBy ?? ""),
      preparationTime: o.preparationTime,
      acceptedAt: o.acceptedDate || o.acceptedAt,
      readyAt: o.readyDate || o.readyAt,
    }));

    return {
      pendingOrders: mapped.filter(o => o.status === "PENDING"),
      acceptedOrders: mapped.filter(o => o.status === "ACCEPTED"),
      readyOrders: mapped.filter(o => o.status === "READY_FOR_PICKUP"),
    };
  }),

  addPendingOrder: (order) => set((state) => {
    // Check if it already exists in any array to prevent duplicates
    const exists = 
      state.pendingOrders.some(o => o.orderId === order.orderId) ||
      state.acceptedOrders.some(o => o.orderId === order.orderId) ||
      state.readyOrders.some(o => o.orderId === order.orderId);
      
    if (exists) return state;
    
    // Add to pending with current timestamp if not present
    const newOrder = {
      ...order,
      createdAt: order.createdAt || new Date().toISOString()
    };
    
    return { pendingOrders: [...state.pendingOrders, newOrder] };
  }),

  updateOrder: (orderId, updates) => set((state) => {
    // Find which list the order is in and update it
    return {
      pendingOrders: state.pendingOrders.map(o => o.orderId === orderId ? { ...o, ...updates } : o),
      acceptedOrders: state.acceptedOrders.map(o => o.orderId === orderId ? { ...o, ...updates } : o),
      readyOrders: state.readyOrders.map(o => o.orderId === orderId ? { ...o, ...updates } : o),
    };
  }),

  moveToAccepted: (orderId, preparationTime) => set((state) => {
    const orderIndex = state.pendingOrders.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) return state; // Order not found in pending
    
    const order = state.pendingOrders[orderIndex];
    const acceptedOrder = { 
      ...order, 
      status: "ACCEPTED",
      preparationTime,
      acceptedAt: new Date().toISOString()
    };
    
    return {
      pendingOrders: state.pendingOrders.filter(o => o.orderId !== orderId),
      acceptedOrders: [...state.acceptedOrders, acceptedOrder]
    };
  }),

  moveToReady: (orderId) => set((state) => {
    const orderIndex = state.acceptedOrders.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) return state; // Order not found in accepted
    
    const order = state.acceptedOrders[orderIndex];
    const readyOrder = { 
      ...order, 
      status: "READY_FOR_PICKUP",
      readyAt: new Date().toISOString()
    };
    
    return {
      acceptedOrders: state.acceptedOrders.filter(o => o.orderId !== orderId),
      readyOrders: [...state.readyOrders, readyOrder]
    };
  }),

  removeOrder: (orderId) => set((state) => ({
    pendingOrders: state.pendingOrders.filter(o => o.orderId !== orderId),
    acceptedOrders: state.acceptedOrders.filter(o => o.orderId !== orderId),
    readyOrders: state.readyOrders.filter(o => o.orderId !== orderId),
  })),

  clearAll: () => set({
    pendingOrders: [],
    acceptedOrders: [],
    readyOrders: []
  })
}));
