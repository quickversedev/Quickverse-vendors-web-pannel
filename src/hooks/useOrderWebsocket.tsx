import { Client } from "@stomp/stompjs";
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-hot-toast';
import SockJS from "sockjs-client";
import { baseurl } from "../apis";
import { useAuthStore } from "../stores/useAuthStore";
import { useOrderStore } from "../stores/useOrderStore";
import type { OrderActionEvent } from "../types/order";

// ✅ Validator for new orders
const isValidOrder = (data: any): data is OrderActionEvent => {
  if (typeof data !== "object" || data === null) return false;
  return (
    typeof data.orderId === "string" &&
    typeof data.totalOrderAmount === "string" &&
    Array.isArray(data.orderItems)
  );
};

// ── WebSocket Hook ───────────────────────────────────────
export const useOrderWebsocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const jwt = useAuthStore((state) => state.jwt);
  const shopId = useAuthStore((state) => state.shopId);
  const addOrder = useOrderStore((state) => state.addOrder);
  const removeOrder = useOrderStore((state) => state.removeOrder);

  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!jwt || !shopId) {
      console.log("STOMP: Missing auth, skipping");
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(baseurl + "/quickVerse/ws"), // 
      debug: (str) => console.log("STOMP:", str),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      onConnect: () => {
        setIsConnected(true);
        console.log("✅ Connected to STOMP");


        const topic = `/topic/vendor/${shopId}`;
        console.log("📡 Subscribing to:", topic);

        client.subscribe(topic, (message) => {
          try {
            const data = JSON.parse(message.body);
            console.log("🔔 WebSocket Message received:", data);

            // 1. Handle Status Updates (ACCEPTED/REJECTED)
            const currentStatus = data.status || data.state;

            if (currentStatus === "ACCEPTED") {
              removeOrder(data.orderId);
              toast.success(`${data.orderId} : Order Accepted`, {
                icon: <CheckCircle className="text-emerald-500 w-6 h-6" />,
                className: "bg-white text-black font-bold p-4 rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.15)]",
              });
            }
            else if (currentStatus === "REJECTED") {
              removeOrder(data.orderId);
              toast.error(`${data.orderId} : Order Rejected`, {
                icon: <XCircle className="text-rose-500 w-6 h-6" />,
                className: "bg-white text-black font-bold p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
              });
            }
            else if (currentStatus === "CANCELLED") {
              removeOrder(data.orderId); // This removes the card and stops sound
              toast.error(`Order #${data.orderId} was Cancelled by Customer`, {
                duration: 5000,
                position: "top-center",
                icon: <XCircle className="text-rose-500 w-6 h-6" />,
                className: "bg-white text-black font-bold p-4 rounded-xl shadow-[0_4px_20px_rgba(239,68,68,0.15)]",
              });
            }

            // 2. Check for New Incoming Orders
            else if (isValidOrder(data)) {
              console.log("➕ New Incoming Order added to grid:", data.orderId);
              addOrder(data);
            }
          } catch (e) {
            console.error("WebSocket Parse error:", e);
          }
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame);
        setIsConnected(false);
      },

      onWebSocketError: (err) => {
        console.error("❌ WS error:", err);
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        console.log("❌ WebSocket Disconnected");
        setIsConnected(false);
      }
    };
  }, [jwt, shopId, addOrder, removeOrder]);

  return isConnected;
};
