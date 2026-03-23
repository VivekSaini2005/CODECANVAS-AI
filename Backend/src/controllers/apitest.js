const axios = require("axios");
const cheerio = require("cheerio");

exports.getLeetcodeHeatmap = async (req, res) => {
    try {
        const { username } = req.params;

        const query = {
            query: `
      query userProfileCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar {
            submissionCalendar
          }
        }
      }`,
            variables: { username }
        };

        const response = await axios.post(
            "https://leetcode.com/graphql",
            query
        );

        const calendar = JSON.parse(
            response.data.data.matchedUser.userCalendar.submissionCalendar
        );

        const result = Object.keys(calendar).map((ts) => ({
            date: new Date(ts * 1000).toISOString().split("T")[0],
            count: calendar[ts]
        }));

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCodeforcesHeatmap = async (req, res) => {
    try {
        const { username } = req.params;

        const response = await axios.get(
            `https://codeforces.com/api/user.status?handle=${username}`
        );

        const submissions = response.data.result;

        const map = {};

        submissions.forEach((sub) => {

            // ✅ Better filtering
            if (sub.verdict && sub.verdict !== "COMPILATION_ERROR") {

                const date = new Date(sub.creationTimeSeconds * 1000)
                    .toLocaleDateString("en-CA", {
                        timeZone: "Asia/Kolkata"
                    });

                map[date] = (map[date] || 0) + 1;
            }
        });

        const result = Object.keys(map).map(date => ({
            date,
            count: map[date]
        }));

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// exports.getCodeforcesHeatmap = async (req, res) => {

//     try {

//         const { username } = req.params;

//         const response = await axios.get(
//             `https://codeforces.com/api/user.status?handle=${username}`
//         );

//         const submissions = response.data.result;

//         const map = {};

//         submissions.forEach((sub) => {

//             if (sub.verdict === "OK") {

//                 const date = new Date(sub.creationTimeSeconds * 1000)
//                     .toISOString()
//                     .split("T")[0];

//                 map[date] = (map[date] || 0) + 1;
//             }
//         });

//         const result = Object.keys(map).map((date) => ({
//             date,
//             count: map[date]
//         }));

//         res.json(result);

//     } catch (err) {

//         res.status(500).json({ error: err.message });
//     }
// };


exports.getCodechefHeatmap = async (req, res) => {
    try {
        const { username } = req.params;

        const url = `https://www.codechef.com/users/${username}`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "text/html",
                "Referer": "https://www.codechef.com/"
            }
        });

        const $ = cheerio.load(response.data);

        let activity = [];
        const activityMap = {}; // To deduplicate and aggregate entries

        $("script").each((i, el) => {
            const text = $(el).html();

            if (text && text.includes("userDailySubmissionsStats")) {

                // 🔥 Extract JSON array
                const match = text.match(/userDailySubmissionsStats\s*=\s*(\[[\s\S]*?\])/);
                
                if (match) {
                    try {
                        const data = JSON.parse(match[1]);

                        // Process and aggregate data
                        data.forEach(item => {
                            if (item.date && item.value !== undefined) {
                                const normalizedDate = normalizeDateFormat(item.date);
                                
                                // Aggregate values for the same date (handle duplicates)
                                if (activityMap[normalizedDate]) {
                                    activityMap[normalizedDate] += item.value;
                                } else {
                                    activityMap[normalizedDate] = item.value;
                                }
                            }
                        });

                    } catch (err) {
                        console.error("JSON parse error:", err);
                    }
                }
            }
        });

        // Convert map to array and filter out zero values
        activity = Object.keys(activityMap)
            .map(date => ({
                date,
                count: activityMap[date]
            }))
            .filter(item => item.count > 0) // Remove entries with 0 value
            .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

        res.json(activity);

    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "Failed to fetch heatmap", message: err.message });
    }
};

// 🔧 Normalize date format from YYYY-M-D to YYYY-MM-DD
function normalizeDateFormat(dateStr) {
    if (typeof dateStr !== 'string') {
        console.warn("Invalid date format:", dateStr);
        return null;
    }

    // Handle formats like '2026-1-14' and convert to '2026-01-14'
    const parts = dateStr.split('-');
    
    if (parts.length !== 3) {
        console.warn("Invalid date format:", dateStr);
        return null;
    }

    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');

    return `${year}-${month}-${day}`;
}


