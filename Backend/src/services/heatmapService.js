const axios = require("axios");
const cheerio = require("cheerio");

function addSubmission(map, date) {
    if (!map[date]) map[date] = 0;
    map[date]++;
}

function formatDate(timestamp) {
    return new Date(timestamp).toISOString().split("T")[0];
}

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

async function getHeatmapData({
    leetcode,
    codeforces,
    codechef
}) {

    const submissionMap = {};

    /* =========================
        1️⃣ LEETCODE
    ========================= */

    if (leetcode) {

        const query = {
            query: `
      query userProfileCalendar($username: String!) {
        matchedUser(username: $username) {
          userCalendar {
            submissionCalendar
          }
        }
      }`,
            variables: { username: leetcode }
        };

        const res = await axios.post(
            "https://leetcode.com/graphql",
            query
        );

        const calendar = JSON.parse(
            res.data.data.matchedUser.userCalendar.submissionCalendar
        );

        for (const timestamp in calendar) {

            const date = formatDate(timestamp * 1000);

            if (!submissionMap[date]) submissionMap[date] = 0;

            submissionMap[date] += calendar[timestamp];
        }
    }

    /* =========================
        2️⃣ CODEFORCES
    ========================= */

    if (codeforces) {

        const res = await axios.get(
            `https://codeforces.com/api/user.status?handle=${codeforces}`
        );

        const submissions = res.data.result;

        submissions.forEach(sub => {

            if (sub.verdict === "OK") {

                const date = formatDate(sub.creationTimeSeconds * 1000);

                addSubmission(submissionMap, date);
            }
        });
    }


    // 3️⃣ CODECHEF (SCRAPING)
    if (codechef) {

        try {
            const url = `https://www.codechef.com/users/${codechef}`;

            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "text/html",
                    "Referer": "https://www.codechef.com/"
                },
                timeout: 10000
            });

            const $ = cheerio.load(data);

            const activityMap = {};

            $("script").each((i, el) => {
                const text = $(el).html();

                if (text && text.includes("userDailySubmissionsStats")) {

                    const match = text.match(/userDailySubmissionsStats\s*=\s*(\[[\s\S]*?\])/);

                    if (match) {
                        try {
                            const parsed = JSON.parse(match[1]);

                            parsed.forEach(item => {
                                if (item.date && item.value !== undefined) {

                                    const normalizedDate = normalizeDateFormat(item.date);

                                    // aggregate duplicates
                                    if (normalizedDate) {
                                        activityMap[normalizedDate] =
                                            (activityMap[normalizedDate] || 0) + item.value;
                                    }
                                }
                            });

                        } catch (err) {
                            console.error("CodeChef JSON parse error:", err.message);
                        }
                    }
                }
            });

            //push into your main submissionMap
            Object.keys(activityMap).forEach(date => {
                if (date) { // Validate date is not null
                    if (!submissionMap[date]) submissionMap[date] = 0;
                    submissionMap[date] += activityMap[date]; // Add count directly
                }
            });

        } catch (err) {
            console.error("CodeChef heatmap fetch error:", err.message);
            // Continue with other platforms even if CodeChef fails
        }
    }

    // if (codechef) {

    //     const url = `https://www.codechef.com/users/${codechef}`;

    //     const { data } = await axios.get(url);

    //     const $ = cheerio.load(data);

    //     // CodeChef doesn't expose submissions directly
    //     // So here we only detect activity (best possible)

    //     $(".rating-data-section").each((i, el) => {

    //         const text = $(el).text();

    //         const match = text.match(/\d{4}-\d{2}-\d{2}/g);

    //         if (match) {

    //             match.forEach(date => addSubmission(submissionMap, date));
    //         }
    //     });
    // }

    // FORMAT FINAL OUTPUT

    const heatmap = Object.keys(submissionMap).map(date => ({
        date,
        count: submissionMap[date]
    }));

    return heatmap;
}

module.exports = { getHeatmapData };