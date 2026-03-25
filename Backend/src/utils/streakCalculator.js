// Backend/src/utils/streakCalculator.js

const calculateStreak = (heatmapData) => {
    if (!heatmapData || heatmapData.length === 0) return 0;
  
    // Sort dates descending
    const sortedData = [...heatmapData]
      .filter((d) => d.count > 0)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  
    if (sortedData.length === 0) return 0;
  
    let currentStreak = 0;
    const today = new Date();
    // Normalize today to start of day (local time to match how dates are generated)
    today.setHours(0, 0, 0, 0);
  
    let currentDateToCheck = today;
  
    // Check if the first date in sortedData is today or yesterday
    // If it's older than yesterday, the streak is broken (0)
    const firstActivityDate = new Date(sortedData[0].date);
    firstActivityDate.setHours(0, 0, 0, 0); // Normalize to midnight
  
    const diffTimeFirst = today - firstActivityDate;
    const diffDaysFirst = Math.floor(diffTimeFirst / (1000 * 60 * 60 * 24));
  
    // Streak is active only if the last activity was today or yesterday
    if (diffDaysFirst > 1) {
      return 0; // Streak broken
    }
  
    // If the latest activity was yesterday, starting check from yesterday
    if (diffDaysFirst === 1) {
      currentDateToCheck = new Date(today);
      currentDateToCheck.setDate(today.getDate() - 1);
    }
  
    for (let i = 0; i < sortedData.length; i++) {
        const itemDate = new Date(sortedData[i].date);
        itemDate.setHours(0,0,0,0);

        if (itemDate.getTime() === currentDateToCheck.getTime()) {
            currentStreak++;
            currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
        } else {
            break;
        }
    }
  
    return currentStreak;
  };
  
  const calculateLongestStreak = (heatmapData) => {
    if (!heatmapData || heatmapData.length === 0) return 0;
  
    // Filter days with activity and sort ascending
    const activeDays = [...heatmapData]
      .filter((d) => d.count > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  
    if (activeDays.length === 0) return 0;
  
    let maxStreak = 1; // At least 1 activity exists
    let tempStreak = 1;
  
    for (let i = 1; i < activeDays.length; i++) {
      const prevDate = new Date(activeDays[i - 1].date);
      const currDate = new Date(activeDays[i].date);
      
      prevDate.setHours(0,0,0,0);
      currDate.setHours(0,0,0,0);
      
      const diffTime = currDate - prevDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
      if (diffDays === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else if (diffDays > 1) {
        tempStreak = 1; // reset
      }
    }
  
    return maxStreak;
  };
  
  const getStreakData = (heatmapData) => {
    return {
      currentStreak: calculateStreak(heatmapData),
      maxStreak: calculateLongestStreak(heatmapData),
    };
  };

module.exports = { calculateStreak, calculateLongestStreak, getStreakData };