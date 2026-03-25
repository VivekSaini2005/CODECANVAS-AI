const pool = require("../config/db")
const { getHeatmapData } = require("../services/heatmapService");
const axios = require("axios")
const cheerio = require("cheerio")


// LEETCODE STATS

exports.syncLeetcode = async (req, res) => {

    try {

        const userId = req.userId

        // 1️⃣ Get username from DB
        const user = await pool.query(
            "SELECT leetcode_username FROM users WHERE id=$1",
            [userId]
        )

        if (user.rows.length === 0) {
            return res.status(404).json({ msg: "User not found" })
        }

        const username = user.rows[0].leetcode_username

        if (!username) {
            console.log("LeetCode username not set");
            if (!res) throw new Error("LeetCode username not set");
            return res.status(400).json({ msg: "LeetCode username not set" })
        }
        // console.log(username);


        const response = await axios.post(
            "https://leetcode.com/graphql",
            {
                query: `
          query userProfile($username: String!) {
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            userContestRanking(username: $username) {
              rating
            }
          }
        `,
                variables: { username }
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        // console.log(response.data);
        if (!response.data.data.matchedUser) {
            return res.status(404).json({
                msg: "Invalid LeetCode username"
            })
        }


        // 4️⃣ Extract stats
        const stats =
            response.data.data.matchedUser.submitStats.acSubmissionNum

        // Extract rating
        const rawRating = response.data.data.userContestRanking?.rating;
        const rating = rawRating ? Math.round(rawRating) : 0;

        let totalSolved = 0
        let easySolved = 0
        let mediumSolved = 0
        let hardSolved = 0


        stats.forEach(stat => {

            if (stat.difficulty === "All")
                totalSolved = stat.count

            if (stat.difficulty === "Easy")
                easySolved = stat.count

            if (stat.difficulty === "Medium")
                mediumSolved = stat.count

            if (stat.difficulty === "Hard")
                hardSolved = stat.count

        })


        // 5️⃣ Store in database
        await pool.query(
            `
      INSERT INTO user_platform_stats
      (user_id,platform,total_solved,easy_solved,medium_solved,hard_solved,rating)
      VALUES($1,'leetcode',$2,$3,$4,$5,$6)
      ON CONFLICT (user_id,platform)
      DO UPDATE SET
        total_solved=$2,
        easy_solved=$3,
        medium_solved=$4,
        hard_solved=$5,
        rating=$6,
        last_synced=NOW()
      `,
            [
                userId,
                totalSolved,
                easySolved,
                mediumSolved,
                hardSolved,
                rating
            ]
        )


        // 6️⃣ Send response
        // res.json({
        //     platform: "leetcode",
        //     username,
        //     totalSolved,
        //     easySolved,
        //     mediumSolved,
        //     hardSolved,
        //     rating
        // })

        return {
            platform: "leetcode",
            username,
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            rating
        }

    }
    catch (err) {

        console.error("LeetCode sync error:", err.message)

        if (!res) throw err;
        res.status(500).json({
            error: "Failed to fetch LeetCode stats"
        })

    }

}



// CODEFORCES STATS

exports.syncCodeforces = async (req, res) => {

    try {

        const userId = req.userId

        const user = await pool.query(
            "SELECT codeforces_username FROM users WHERE id=$1",
            [userId]
        )

        const username = user.rows[0].codeforces_username

        if (!username) {
            console.log("Codeforces username not set");
            if (!res) throw new Error("Codeforces username not set");
            return res.status(400).json({ msg: "Codeforces username not set" })
        }


        const info = await axios.get(
            `https://codeforces.com/api/user.info?handles=${username}`
        )

        const userInfo = info.data.result[0]


        const submissions = await axios.get(
            `https://codeforces.com/api/user.status?handle=${username}`
        )


        const solvedProblems = new Set()

        submissions.data.result.forEach(sub => {
            if (sub.verdict === "OK") {
                solvedProblems.add(sub.problem.name)
            }
        })


        await pool.query(
            `
      INSERT INTO user_platform_stats
      (user_id,platform,total_solved,rating)
      VALUES($1,'codeforces',$2,$3)
      ON CONFLICT (user_id,platform)
      DO UPDATE SET
      total_solved=$2,
      rating=$3,
      last_synced=NOW()
      `,
            [
                userId,
                solvedProblems.size,
                userInfo.rating
            ]
        )

        // res.json({
        //     platform: "codeforces",
        //     solved: solvedProblems.size,
        //     rating: userInfo.rating
        // })

        return {
            platform: "codeforces",
            solved: solvedProblems.size,
            rating: userInfo.rating
        }

    }
    catch (err) {
        console.error("Codeforces sync error:", err.message);
        // Throw the error instead of sending a response when called internally
        if (!res) throw err;
        res.status(500).json({ error: err.message })
    }

}




// CODECHEF STATS

exports.syncCodechef = async (req, res) => {

    try {

        const userId = req.userId

        const user = await pool.query(
            "SELECT codechef_username FROM users WHERE id=$1",
            [userId]
        )

        const username = user.rows[0].codechef_username

        if (!username) {
            console.log("CodeChef username not set");
            if (!res) throw new Error("CodeChef username not set");
            return res.status(400).json({ msg: "CodeChef username not set" })
        }

        const url = `https://www.codechef.com/users/${username}`

        const response = await axios.get(url)

        const $ = cheerio.load(response.data)

        let rating = $(".rating-number").first().text().trim()
        const stars = $(".rating").first().text().trim()

        // If the rating is empty/not found, set it to 0 or null so PostgreSQL doesn't crash on empty string
        if (!rating || rating === "") {
            rating = 0; // or null, if your DB allows null
        } else {
            rating = parseInt(rating) || 0;
        }

        // console.log($(".rating-data-section.problems-solved").text());

        const solvedText = $(".rating-data-section.problems-solved").text()

        const match = solvedText.match(/Total Problems Solved:\s*(\d+)/)

        let totalSolved = match ? parseInt(match[1]) : 0
        if(isNaN(totalSolved)) totalSolved = 0;

        await pool.query(
            `
            INSERT INTO user_platform_stats
            (user_id,platform,total_solved,rating)
            VALUES($1,'codechef',$2,$3)
            ON CONFLICT (user_id,platform)
            DO UPDATE SET
            total_solved=$2,
            rating=$3,
            last_synced=NOW()
            `,
            [userId, totalSolved, rating]
        )


        // res.json({
        //     platform: "codechef",
        //     rating,
        //     stars,
        //     totalSolved
        // })
        return {
            platform: "codechef",
            rating,
            stars,
            totalSolved
        }

    }
    catch (err) {
        console.error("Codechef sync error:", err.message);
        if (!res) throw err;
        res.status(500).json({ error: err.message })
    }

}



// GET ALL PLATFORMS FROM DB ONLY
exports.getPlatformStats = async (req, res) => {
    try {
        const userId = req.userId;

        const { rows } = await pool.query(
            "SELECT * FROM user_platform_stats WHERE user_id=$1",
            [userId]
        );

        let leetcode = null;
        let codeforces = null;
        let codechef = null;

        rows.forEach(row => {
            if (row.platform === "leetcode") {
                leetcode = {
                    platform: "leetcode",
                    totalSolved: row.total_solved,
                    easySolved: row.easy_solved,
                    mediumSolved: row.medium_solved,
                    hardSolved: row.hard_solved,
                    rating: row.rating,
                    lastSynced: row.last_synced
                };
            } else if (row.platform === "codeforces") {
                codeforces = {
                    platform: "codeforces",
                    solved: row.total_solved,
                    rating: row.rating,
                    lastSynced: row.last_synced
                };
            } else if (row.platform === "codechef") {
                codechef = {
                    platform: "codechef",
                    totalSolved: row.total_solved,
                    rating: row.rating,
                    lastSynced: row.last_synced
                };
            }
        });

        res.json({
            leetcode,
            codeforces,
            codechef
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch stored platform stats" });
    }
};

// SYNC ALL PLATFORMS

exports.syncAllPlatforms = async (req, res) => {

    try {
        console.log("start platform sync");
        
        let leetcode = null;
        let codeforces = null;
        let codechef = null;

        try {
            leetcode = await exports.syncLeetcode(req, null)
            console.log("leetcode done");
        } catch (e) {
            console.log("leetcode sync neglected/failed:", e.message);
        }
        
        try {
            codeforces = await exports.syncCodeforces(req, null)
            console.log("codeforces done"); 
        } catch (e) {
            console.log("codeforces sync neglected/failed:", e.message);
        }
        
        try {
            codechef = await exports.syncCodechef(req, null)
            console.log("codechef done");
        } catch (e) {
            console.log("codechef sync neglected/failed:", e.message);
        }
        
        console.log("all sync attempts completed");
        
        res.json({
            leetcode,
            codeforces,
            codechef
        })

    }
    catch (err) {
        console.error("Critical error in syncAllPlatforms:", err);
        res.status(500).json({ error: err.message})
    }

}


exports.getUserHeatmap = async (req, res) => {

    try {
        const userId = req.userId

        const user = await pool.query(
            "SELECT * FROM users WHERE id=$1",
            [userId]
        )

        if (user.rows.length === 0) {
            return res.status(404).json({ msg: "User not found" })
        }

        const leetcode_username = user.rows[0].leetcode_username
        const codeforces_username = user.rows[0].codeforces_username
        const codechef_username = user.rows[0].codechef_username

        const heatmap = await getHeatmapData({
            leetcode: leetcode_username,
            codeforces: codeforces_username,
            codechef: codechef_username
        });

        res.json(heatmap);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: "Failed to fetch heatmap" });
    }
};
