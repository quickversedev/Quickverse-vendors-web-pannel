import { useState, useEffect } from "react";

/**
 * Hook to manage order timers. 
 * Can count UP (elapsed time) or DOWN (remaining time).
 */
export const useOrderTimer = (startTime: string | undefined, type: "UP" | "DOWN", durationMinutes: number = 0) => {
  const [displayTime, setDisplayTime] = useState("--:--");
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!startTime) return;

    const startTimestamp = new Date(startTime).getTime();
    if (isNaN(startTimestamp)) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      
      if (type === "UP") {
        // Count UP: How much time has passed since startTime
        const diffInSeconds = Math.floor((now - startTimestamp) / 1000);
        
        if (diffInSeconds < 0) {
           setDisplayTime("00:00");
           return;
        }

        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = diffInSeconds % 60;
        setDisplayTime(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      } 
      else {
        // Count DOWN: How much time is remaining from (startTime + durationMinutes)
        const targetTimestamp = startTimestamp + (durationMinutes * 60 * 1000);
        const diffInSeconds = Math.floor((targetTimestamp - now) / 1000);
        
        if (diffInSeconds < 0) {
          setIsOverdue(true);
          const absDiff = Math.abs(diffInSeconds);
          const minutes = Math.floor(absDiff / 60);
          const seconds = absDiff % 60;
          setDisplayTime(`-${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
        } else {
          setIsOverdue(false);
          const minutes = Math.floor(diffInSeconds / 60);
          const seconds = diffInSeconds % 60;
          setDisplayTime(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
        }
      }
    }, 1000);

    // Initial calculation so it doesn't wait 1 second
    return () => clearInterval(intervalId);
  }, [startTime, type, durationMinutes]);

  return { displayTime, isOverdue };
};
