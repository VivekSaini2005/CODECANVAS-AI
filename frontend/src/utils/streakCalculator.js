/**
 * Calculate current streak from heatmap data
 * Streak is the number of consecutive days with at least 1 submission
 * @param {Array} heatmapData - Array of objects with date and count properties
 * @returns {number} Current streak count
 */
export const calculateStreak = (heatmapData) => {
  if (!heatmapData || heatmapData.length === 0) {
    return 0;
  }

  // Create a map of dates to activity counts
  const activityMap = {};
  heatmapData.forEach((item) => {
    activityMap[item.date] = item.count;
  });

  // Start from today and go backwards
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  // Check each day going backwards
  while (true) {
    const dateString = formatDate(currentDate);
    const hasActivity = activityMap[dateString] && activityMap[dateString] > 0;

    if (hasActivity) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If today has no activity, check if it's today we're checking
      // If it's today with no activity, streak is broken
      if (dateString === formatDate(today)) {
        break;
      }
      // If it's a past date with no activity, streak is broken
      break;
    }

    // Safety check to prevent infinite loops
    if (streak > 365) {
      break;
    }
  }

  return streak;
};

/**
 * Calculate longest streak from heatmap data
 * @param {Array} heatmapData - Array of objects with date and count properties
 * @returns {number} Longest streak count
 */
export const calculateLongestStreak = (heatmapData) => {
  if (!heatmapData || heatmapData.length === 0) {
    return 0;
  }

  // Create a sorted array of dates with activity
  const activeDates = heatmapData
    .filter((item) => item.count > 0)
    .map((item) => new Date(item.date))
    .sort((a, b) => a - b);

  if (activeDates.length === 0) {
    return 0;
  }

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < activeDates.length; i++) {
    const prevDate = activeDates[i - 1];
    const currentDate = activeDates[i];

    // Check if dates are consecutive (1 day apart)
    const dayDifference = Math.floor(
      (currentDate - prevDate) / (1000 * 60 * 60 * 24)
    );

    if (dayDifference === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

/**
 * Get streak data including current and longest streaks
 * @param {Array} heatmapData - Array of objects with date and count properties
 * @returns {Object} Object with currentStreak and longestStreak properties
 */
export const getStreakData = (heatmapData) => {
  return {
    currentStreak: calculateStreak(heatmapData),
    longestStreak: calculateLongestStreak(heatmapData),
  };
};
