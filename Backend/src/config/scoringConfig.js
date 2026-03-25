/**
 * Leaderboard Scoring Configuration
 * Adjust the point values here to change scoring distribution
 */

const SCORING_WEIGHTS = {
    // Problem difficulty-based points
    difficulty: {
        easy: 3,
        medium: 5,
        hard: 7
    }
};

module.exports = SCORING_WEIGHTS;
