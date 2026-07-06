import { create } from 'zustand';
import type { Order } from '../types/order';

interface DashboardState {
  pendingOrders: Order[];
  acceptedOrders: Order[];
  readyOrders: Order[];
  
  addPendingOrder: (order: Order) => void;
  setInitialOrders: (orders: Order[]) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  moveToAccepted: (orderId: string, preparationTime: number) => void;
  moveToReady: (orderId: string) => void;
  removeOrder: (orderId: string) => void;
  clearAll: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  pendingOrders: [],
  acceptedOrders: [],
  readyOrders: [],

  // 1. MANUAL REFRESH / INITIAL LOAD (REST API)
  // Smart-merge: preserves locally-set readyDate/acceptedDate/preparationTime
  // so timers don't reset when the API returns them as null after a poll.
  setInitialOrders: (orders) => set((state) => {
    // Build a flat lookup of all orders currently in the store
    const allExisting = [
      ...state.pendingOrders,
      ...state.acceptedOrders,
      ...state.readyOrders,
    ];

    const smartMerge = (incoming: Order): Order => {
      const existing = allExisting.find(e => e.orderId === incoming.orderId);
      if (!existing) return incoming;
      return {
        ...incoming,
        // LOCAL-FIRST: always keep locally-set timestamps.
        // Use || (not ??) so even a non-null API value doesn't overwrite
        // the local UTC string set by moveToAccepted / moveToReady.
        readyDate:        existing.readyDate        || incoming.readyDate,
        acceptedDate:     existing.acceptedDate     || incoming.acceptedDate,
        preparationTime:  existing.preparationTime  || incoming.preparationTime,
      };
    };

    return {
      pendingOrders:  orders.filter(o => o.state === "PENDING").map(smartMerge),
      acceptedOrders: orders.filter(o => o.state === "ACCEPTED").map(smartMerge),
      readyOrders:    orders.filter(o => o.state === "READY_FOR_PICKUP").map(smartMerge),
    };
  }),

  // 2. WEBSOCKET INCOMING
  addPendingOrder: (order) => set((state) => {
    const exists = 
      state.pendingOrders.some(o => o.orderId === order.orderId) ||
      state.acceptedOrders.some(o => o.orderId === order.orderId) ||
      state.readyOrders.some(o => o.orderId === order.orderId);
      
    if (exists) return state;
    
    // Naya order hamesha PENDING me jayega
    const newOrder: Order = { ...order, state: "PENDING" };
    return { pendingOrders: [...state.pendingOrders, newOrder] };
  }),

  updateOrder: (orderId, updates) => set((state) => ({
    pendingOrders: state.pendingOrders.map(o => o.orderId === orderId ? { ...o, ...updates } : o),
    acceptedOrders: state.acceptedOrders.map(o => o.orderId === orderId ? { ...o, ...updates } : o),
    readyOrders: state.readyOrders.map(o => o.orderId === orderId ? { ...o, ...updates } : o),
  })),

  moveToAccepted: (orderId, preparationTime) => set((state) => {
    const orderIndex = state.pendingOrders.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) return state; 
    
    const order = state.pendingOrders[orderIndex];
    const acceptedOrder: Order = { 
      ...order, 
      state: "ACCEPTED",
      preparationTime,
      acceptedDate: new Date().toISOString()
    };
    
    return {
      pendingOrders: state.pendingOrders.filter(o => o.orderId !== orderId),
      acceptedOrders: [...state.acceptedOrders, acceptedOrder]
    };
  }),

  moveToReady: (orderId) => set((state) => {
    const orderIndex = state.acceptedOrders.findIndex(o => o.orderId === orderId);
    if (orderIndex === -1) return state; 
    
    const order = state.acceptedOrders[orderIndex];
    const readyOrder: Order = { 
      ...order, 
      state: "READY_FOR_PICKUP",
      readyDate: new Date().toISOString()
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