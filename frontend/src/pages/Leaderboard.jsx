import { useEffect, useState } from "react";
import API from "../api/axiosInstance"
import { Trophy, Medal, Award } from "lucide-react";
import PodiumCard from "../components/PodiumCard";
import MountainClimbImg from "../images/Leader.png";

export default function LeaderboardPage() {

    const [users, setUsers] = useState([]);

    const fetchLeaderboard = async () => {
        try {
            const { data } = await API.get("/progress/leaderboard");
            setUsers(data.leaderboard || []);
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank) => {
        const baseClass = "flex items-center gap-2 justify-center";
        const badgeClass = "px-2 py-1 rounded-md bg-white/5 font-bold";

        switch (rank) {
            case 1:
                return (
                    <div className={baseClass}>
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        <span className={badgeClass}>#{rank}</span>
                    </div>
                );
            case 2:
                return (
                    <div className={baseClass}>
                        <Medal className="w-6 h-6 text-gray-300" />
                        <span className={badgeClass}>#{rank}</span>
                    </div>
                );
            case 3:
                return (
                    <div className={baseClass}>
                        <Award className="w-6 h-6 text-orange-400" />
                        <span className={badgeClass}>#{rank}</span>
                    </div>
                );
            default:
                return (
                    <div className={baseClass}>
                        <span className={`${badgeClass} text-sm text-gray-400`}>#{rank}</span>
                    </div>
                );
        }
    };

    const top3 = users.slice(0, 3);

    return (
        <>
            {/* HERO SECTION */}
            <div className="w-full animate-fade-in-up bg-gradient-to-r from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-white/5 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 gap-10">
                    
                    {/* Left → Text content */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium mb-4">
                        Leaderboard Arena
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.2]">
                        <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">Climb Higher</span> with Every Problem
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg max-w-xl">
                        Every challenge you solve brings you closer to the top. Track your progress and rise through the ranks.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                        <button onClick={() => document.getElementById('leaderboard-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md">
                            View Leaderboard
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3 md:mt-4">
                        Keep climbing. Stay consistent.
                    </p>
                </div>

                {/* Right → Image */}
                <div className="flex-1 w-full flex justify-center md:justify-end order-first md:order-last mt-8 md:mt-0">
                    <div className="relative w-full max-w-xl aspect-video md:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-transparent dark:border-white/5 group">
                        <img 
                            src={MountainClimbImg} 
                            alt="Mountain Climbing Leaderboard Metaphor" 
                            className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                    </div>
                </div>

                </div>
            </div>

            {/* LEADERBOARD CONTAINER */}
            <div id="leaderboard-section" className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pb-12">

            {/* 🏆 Top 3 Podium */}
            {top3.length === 3 && (
                <div className="flex flex-col md:flex-row gap-3 sm:gap-6 mb-16 max-w-4xl mx-auto items-center md:items-end">

                    <PodiumCard user={top3[1]} rank={2} />
                    <PodiumCard user={top3[0]} rank={1} />
                    <PodiumCard user={top3[2]} rank={3} />

                </div>
            )}

            {/* 📊 Table */}
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl shadow-soft overflow-hidden">

                <div className="w-full overflow-x-auto"><table className="w-full text-left">

                    <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-center">Rank</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4">User</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-center hidden md:table-cell">Ratings (LC / CF / CC)</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Solved</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Score</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user) => {

                            return (
                                <tr key={user.id} className={`border-b border-white/5 transition-all duration-300 hover:bg-white/5 hover:scale-[1.01] ${user.rank === 1 ? 'bg-yellow-500/5' : ''}`}>

                                    {/* Rank */}
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                        {getRankIcon(user.rank)}
                                    </td>

                                    {/* User */}
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-3">

                                        <img
                                            src={`${user.profileimage}`}
                                            className="w-8 h-8 rounded-full border border-white/10 object-cover transition-all duration-300 hover:scale-[1.15]" />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-sm transition-colors hover:text-indigo-400 cursor-pointer truncate max-w-[120px] sm:max-w-xs md:max-w-none">
                                                {user.name}
                                            </div>
                                        </div>

                                    </td>

                                    {/* Ratings */}
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                        <div className="flex items-center justify-center gap-1 text-xs font-medium">
                                            <span className="text-yellow-500" title="LeetCode">{user.lc_rating || 0}</span>
                                            <span className="text-gray-500">|</span>
                                            <span className="text-blue-500" title="Codeforces">{user.cf_rating || 0}</span>
                                            <span className="text-gray-500">|</span>
                                            <span className="text-green-500" title="CodeChef">{user.cc_rating || 0}</span>
                                        </div>
                                    </td>

                                    {/* Total Solved */}
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-semibold text-green-400">
                                        {user.total_solved}
                                    </td>

                                    {/* Score */}
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-semibold text-indigo-400">
                                        {user.score}
                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table></div>
            </div>

            </div>
        </>
    );
}