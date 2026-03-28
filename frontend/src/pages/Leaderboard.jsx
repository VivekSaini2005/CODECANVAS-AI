import { useEffect, useState } from "react";
import API from "../api/axiosInstance"
import { Trophy, Medal, Award } from "lucide-react";
import PodiumCard from "../components/PodiumCard";

export default function LeaderboardPage() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        const { data } = await API.get("/progress/leaderboard");
        console.log(data.leaderboard);
        setUsers(data.leaderboard || []);
    };

    const getRankIcon = (rank) => {
        const baseClass = "flex items-center gap-2 justify-center";

        switch (rank) {
            case 1:
                return (
                    <div className={baseClass}>
                        <Trophy className="w-7 h-7 text-yellow-500" />
                        <span className="font-bold">#{rank}</span>
                    </div>
                );
            case 2:
                return (
                    <div className={baseClass}>
                        <Medal className="w-7 h-7 text-slate-400" />
                        <span className="font-bold">#{rank}</span>
                    </div>
                );
            case 3:
                return (
                    <div className={baseClass}>
                        <Award className="w-7 h-7 text-orange-600" />
                        <span className="font-bold">#{rank}</span>
                    </div>
                );
            default:
                return (
                    <span className="flex items-center gap-2 justify-center font-bold ">
                        #{rank}
                    </span>
                );
        }
    };

    const top3 = users.slice(0, 3);

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">

            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold mb-3">Leaderboard</h1>
                <p className="text-gray-500">Top coders on CodeCanvas</p>
            </div>

            {/* 🏆 Top 3 Podium */}
            {top3.length === 3 && (
                <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto items-end">

                    <PodiumCard user={top3[1]} rank={2} />
                    <PodiumCard user={top3[0]} rank={1} />
                    <PodiumCard user={top3[2]} rank={3} />

                </div>
            )}

            {/* 📊 Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">

                <table className="w-full text-left">

                    <thead className="bg-gray-100 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-4 text-center">Rank</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4 text-center">Ratings (LC / CF / CC)</th>
                            <th className="px-6 py-4 text-right">Solved</th>
                            <th className="px-6 py-4 text-right">Score</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user) => {

                            return (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-800">

                                    {/* Rank */}
                                    <td className="px-6 py-4 text-center">
                                        {getRankIcon(user.rank)}
                                    </td>

                                    {/* User */}
                                    <td className="px-6 py-4 flex items-center gap-3">

                                        <img
                                            src={`${user.profileimage}`}
                                            className="w-10 h-10 rounded-full"
                                        />

                                        <div>
                                            <div className="font-bold">
                                                {user.name}
                                            </div>
                                        </div>

                                    </td>

                                    {/* Ratings */}
                                    <td className="px-6 py-4 text-center text-sm font-medium">
                                        <span className="text-yellow-600" title="LeetCode">{user.lc_rating || 0}</span>
                                        <span className="text-gray-500 dark:text-gray-400 mx-1">|</span>
                                        <span className="text-blue-500" title="Codeforces">{user.cf_rating || 0}</span>
                                        <span className="text-gray-500 dark:text-gray-400 mx-1">|</span>
                                        <span className="text-green-600" title="CodeChef">{user.cc_rating || 0}</span>
                                    </td>

                                    {/* Total Solved */}
                                    <td className="px-6 py-4 text-right font-bold text-green-500">
                                        {user.total_solved}
                                    </td>

                                    {/* Score */}
                                    <td className="px-6 py-4 text-right font-bold text-blue-500">
                                        {user.score}
                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>
            </div>

        </div>
    );
}