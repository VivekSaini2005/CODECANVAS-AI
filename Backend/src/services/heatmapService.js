const axios = require("axios");
const cheerio = require("cheerio");

function addSubmission(map, date) {
    if (!map[date]) map[date] = 0;
    map[date]++;
}

function formatDate(timestamp) {
    return new Date(timestamp).toISOString().split("T")[0];
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

        const url = `https://www.codechef.com/users/${codechef}`;

        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        // CodeChef doesn't expose submissions directly
        // So here we only detect activity (best possible)

        $(".rating-data-section").each((i, el) => {

            const text = $(el).text();

            const match = text.match(/\d{4}-\d{2}-\d{2}/g);

            if (match) {

                match.forEach(date => addSubmission(submissionMap, date));
            }
        });
    }

    // FORMAT FINAL OUTPUT

    const heatmap = Object.keys(submissionMap).map(date => ({
        date,
        count: submissionMap[date]
    }));

    return heatmap;
}

module.exports = { getHeatmapData };