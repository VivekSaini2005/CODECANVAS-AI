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

            if (sub.verdict === "OK") {

                const date = new Date(sub.creationTimeSeconds * 1000)
                    .toISOString()
                    .split("T")[0];

                map[date] = (map[date] || 0) + 1;
            }
        });

        const result = Object.keys(map).map((date) => ({
            date,
            count: map[date]
        }));

        res.json(result);

    } catch (err) {

        res.status(500).json({ error: err.message });
    }
};

// exports.getCodechefStats = async (req, res) => {

//     try {

//         const { username } = req.params;

//         const { data } = await axios.get(
//             `https://www.codechef.com/users/${username}`
//         );

//         const $ = cheerio.load(data);

//         const rating = $(".rating-number").first().text();

//         res.json({
//             username,
//             rating
//         });

//     } catch (err) {

//         res.status(500).json({ error: err.message });
//     }
// };


exports.getCodechefHeatmap = async (req, res) => {

    try {

        const { username } = req.params;

        const pages = 5; // adjust for more history
        const activity = {};

        for (let page = 0; page < pages; page++) {

            const url =
                `https://www.codechef.com/api/submissions/${username}?page=${page}`;

            const response = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            });

            const submissions = response.data.data;

            if (!submissions || submissions.length === 0) break;

            submissions.forEach(sub => {

                const date = new Date(sub.submission_date)
                    .toISOString()
                    .split("T")[0];

                activity[date] = (activity[date] || 0) + 1;

            });

        }

        const heatmap = Object.keys(activity).map(date => ({
            date,
            count: activity[date]
        }));

        res.json(heatmap);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "CodeChef heatmap failed" });

    }
};

