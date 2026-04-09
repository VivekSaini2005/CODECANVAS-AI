import { useEffect, useState } from "react";

function ProgressBar({ value }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Add a slight delay to trigger the animation on mount
    const timer = setTimeout(() => {
      setWidth(value || 0);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-1.5 sm:h-3 overflow-hidden relative">

      <div
        className="h-1.5 sm:h-3 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:opacity-20"
        style={{ width: `${width}%` }}
      />

    </div>
  )

}

export default ProgressBar