import { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useOrderWebsocket } from "../hooks/useOrderWebsocket";
import { useDashboardStore } from "../stores/useDashboardStore";
import { notificationAudio } from "../utils/audio";
import { useCallback } from "react";

const Layout = () => {
  // 1. Initialize WebSocket (No arguments needed now)
   useOrderWebsocket();
  const isPlayingRef = useRef(false); // Add this at the top with other hooks

  // 2. Get pending orders from the new dashboard store
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const pendingOrders = useDashboardStore((state) => state.pendingOrders);

  const playIfNeeded = useCallback(() => {
    const hasUnviewedOrders = pendingOrders.length > 0;
    
    if (hasUnviewedOrders && !isPlayingRef.current) {
      notificationAudio.play()
        .then(() => {
          isPlayingRef.current = true;
        })
        .catch(() => {
          setIsAudioBlocked(true);
        });
    }
  }, [pendingOrders]);

  useEffect(() => {
    const hasUnviewedOrders = pendingOrders.length > 0;

    //  Play sound if there are pending orders, stop if list is empty
    if (hasUnviewedOrders) {
      playIfNeeded();
    } else {
      notificationAudio.pause();
      notificationAudio.currentTime = 0;
      isPlayingRef.current = false;
    }
  }, [pendingOrders, playIfNeeded]);

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
