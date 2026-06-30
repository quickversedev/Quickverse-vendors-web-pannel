export interface OrderActionEvent {
  orderId: string;
  totalOrderAmount: string;
  totalQuantity: string;
  orderDescription: string;
  orderItems: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  id: string;
  status: string;
  message: string;
  createdAt: string;
  createdBy: string;
  // New fields for real-time dashboard
  preparationTime?: number;
  acceptedAt?: string;
  readyAt?: string;
  riderName?: string;
  riderETA?: string;
}

export interface OrderApiResponse {
   orderId: string;
   campusId: string;
   shopId: number;
   customerId: number;
   customerName: string;
   creationTime: string;
   customerMobile: number;
   customerAddress: string;
   state: string;               
   acceptedDate?: string | null;
   completedDate?: string | null;
   rejectedDate?: string | null;
   orderItem: OrderItem[];
   totalAmount: number;
   totalItemCount: number;
   paymentMethod?: string; 
   orderDescription: string;
}

export interface OrderItem {
  id: number;
  name: string;
  itemCount: number;
  itemPrice?: number;
}