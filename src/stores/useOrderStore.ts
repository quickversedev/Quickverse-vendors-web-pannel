import { create } from 'zustand';
import type { Order } from '../types/order';

interface OrderState {
  incomingOrders: Order[];
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  clearAll: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  incomingOrders: [],

  addOrder: (order) => set((state) => {
    // Duplicate check to prevent double notifications
    if (state.incomingOrders.some(o => o.orderId === order.orderId)) return state;
    return { incomingOrders: [...state.incomingOrders, order] };
  }),

  removeOrder: (orderId) => set((state) => ({
    incomingOrders: state.incomingOrders.filter(o => o.orderId !== orderId)
  })),

  clearAll: () => set({ incomingOrders: [] }),
}));

// Expose to window for debugging 
(window as any).orderStore = useOrderStore;