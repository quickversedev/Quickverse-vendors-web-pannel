import { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useOrderWebsocket } from "../hooks/useOrderWebsocket";
import { useOrderStore } from "../stores/useOrderStore"; // 
import { notificationAudio } from "../utils/audio";
import { useCallback } from "react";

const Layout = () => {
  // 1. Initialize WebSocket (No arguments needed now)
   useOrderWebsocket();
  const isPlayingRef = useRef(false); // Add this at the top with other hooks

  // 2. Get incoming orders and viewed status from the store to manage sound
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const incomingOrders = useOrderStore((state) => state.incomingOrders);
  const viewedOrderIds = useOrderStore((state) => state.viewedOrderIds);

  const playIfNeeded = useCallback(() => {
  const hasUnviewedOrders = incomingOrders.some(
    order => !viewedOrderIds.has(order.orderId)
  );
  if (hasUnviewedOrders && !isPlayingRef.current) {
    notificationAudio.play()
      .then(() => {
        isPlayingRef.current = true;
      })
      .catch(() => {
        setIsAudioBlocked(true);
      });
  }
}, [incomingOrders, viewedOrderIds]);
  useEffect(() => {
    // Check if there is at least one order that hasn't been viewed yet
    const hasUnviewedOrders = incomingOrders.some(order => !viewedOrderIds.has(order.orderId));

    //  Play sound if there are UNVIEWED orders, stop if all are viewed (or list is empty)
    if (hasUnviewedOrders) {
      playIfNeeded();
    } else {
      notificationAudio.pause();
      notificationAudio.currentTime = 0;
      isPlayingRef.current = false;
    }
  }, [incomingOrders, viewedOrderIds]);

  return (
    <main className="h-screen bg-[#F1F5F9] dark:bg-zinc-950 p-4">
      <div className="flex h-full gap-4">
        {/* Sidebar stays exactly same */}
        <Sidebar />

        <section className="h-full w-[85%] rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Navbar  />

          <div className="h-[90%] overflow-y-auto p-5">
            {/* Dashboard grid will render here via Outlet */}
            <Outlet />
          </div>
        </section>
      </div>

      {isAudioBlocked && (
        <div className="fixed bottom-4 right-4 z-[100] animate-bounce">
          <button
            onClick={() => {

              notificationAudio.play().then(() => {
                notificationAudio.pause();
                notificationAudio.currentTime = 0;
                setIsAudioBlocked(false);
                playIfNeeded();
              });
            }}
            className="bg-emerald-500 text-black px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            🔔 Enable Sound
          </button>
        </div>
      )}
    </main>
  );
};

export default Layout;
