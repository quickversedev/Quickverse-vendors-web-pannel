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
        <>
          {/* Dark overlay to force attention */}
          <div className="fixed inset-0 bg-black/40 z-[99]" />
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <button
              onClick={() => {
                notificationAudio.play().then(() => {
                  notificationAudio.pause();
                  notificationAudio.currentTime = 0;
                  setIsAudioBlocked(false);
                  playIfNeeded();
                });
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl flex items-center gap-3 transition-all"
              style={{
                animation: "pulse-glow 1s ease-in-out infinite",
              }}
            >
              <span style={{ animation: "blink 0.8s step-end infinite", fontSize: "28px" }}>🔔</span>
              Tap to Enable Sound
            </button>
          </div>
          <style>{`
            @keyframes pulse-glow {
              0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(239,68,68,0.5); }
              50% { transform: scale(1.08); box-shadow: 0 0 40px rgba(239,68,68,0.8), 0 0 80px rgba(239,68,68,0.3); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        </>
      )}
    </main>
  );
};

export default Layout;
