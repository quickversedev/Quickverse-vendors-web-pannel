import { useEffect, useState, useRef, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { useOrderWebsocket } from "../hooks/useOrderWebsocket";
import { useDashboardStore } from "../stores/useDashboardStore";
import { notificationAudio } from "../utils/audio";

const Layout = () => {
  useOrderWebsocket();
  const isPlayingRef = useRef(false);

  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pendingOrders = useDashboardStore((state) => state.pendingOrders);

  const playIfNeeded = useCallback(() => {
    const hasUnviewedOrders = pendingOrders.length > 0;
    if (hasUnviewedOrders && !isPlayingRef.current) {
      notificationAudio.play()
        .then(() => { isPlayingRef.current = true; })
        .catch(() => { setIsAudioBlocked(true); });
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
    <main className="h-screen bg-[#F1F5F9] dark:bg-zinc-950 lg:p-4">
      {/* ─── DESKTOP LAYOUT ─── */}
      <div className="hidden lg:flex h-full gap-4">
        <Sidebar
          isMobileOpen={false}
          onMobileClose={() => {}}
        />
        <section className="h-full flex-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
          <Navbar onHamburgerClick={() => {}} />
          <div className="flex-1 overflow-y-auto p-5">
            <Outlet />
          </div>
        </section>
      </div>

      {/* ─── MOBILE LAYOUT ─── */}
      <div className="flex lg:hidden flex-col h-full">
        {/* Mobile Sidebar Drawer Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />
        </div>

        {/* Mobile Topbar */}
        <div className="shrink-0 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-sm">
          <Navbar onHamburgerClick={() => setIsMobileSidebarOpen(true)} />
        </div>

        {/* Mobile Scrollable Content — padded bottom for BottomNav */}
        <div className="flex-1 overflow-y-auto bg-[#F1F5F9] dark:bg-zinc-950 pb-20">
          <div className="p-3">
            <Outlet />
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>

      {/* ─── AUDIO BLOCKED PROMPT ─── */}
      {isAudioBlocked && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[99]" />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              style={{ animation: "pulse-glow 1s ease-in-out infinite" }}
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
