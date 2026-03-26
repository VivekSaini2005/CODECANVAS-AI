import { Trophy, Medal, Award } from "lucide-react";

function PodiumCard({ user, rank }) {

    const getIcon = () => {
        if (rank === 1) return <Trophy className="w-14 h-14 text-yellow-500 dark:text-yellow-400" />;
        if (rank === 2) return <Medal className="w-12 h-12 text-slate-300 dark:text-slate-200" />;
        return <Award className="w-12 h-12 text-orange-400 dark:text-orange-300" />;
    };

    const getRankStyles = () => {
        if (rank === 1) return "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/40 ring-yellow-400 dark:ring-yellow-500/50";
        if (rank === 2) return "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-700/40 ring-slate-300 dark:ring-slate-400/50";
        return "bg-gradient-to-br from-orange-50/50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20 ring-orange-300 dark:ring-orange-400/50 scale-95 opacity-90 hover:opacity-100 hover:scale-100";
    };

    const getAvatarRing = () => {
        if (rank === 1) return "ring-yellow-400/80 dark:ring-yellow-500/80";
        if (rank === 2) return "ring-slate-300/80 dark:ring-slate-300/80";
        return "ring-orange-300/80 dark:ring-orange-400/80";
    };

    return (
        <div className={`p-6 rounded-xl text-center shadow-md transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer ring-1 ring-black/5 dark:ring-white/5 hover:ring-opacity-20
            ${getRankStyles()}
        `}>

            <div className="mb-4 flex justify-center drop-shadow-md transition-transform duration-300 hover:rotate-6 hover:scale-110">{getIcon()}</div>

            <img
                src={user.profileimage}
                className={`w-20 h-20 rounded-full mx-auto mb-3 object-cover shadow-inner ring-4 transition-all duration-300 hover:shadow-lg ${getAvatarRing()}`}
                alt={user.name}
            />

            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-tight transition-colors hover:text-blue-600 dark:hover:text-blue-400">{user.name}</h3>

            <div className="text-3xl font-extrabold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 drop-shadow-sm transition-transform hover:scale-110">
                {user.total_solved}
            </div>

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Solved</p>

            <div className="mt-3 py-1.5 px-3 bg-white/60 dark:bg-black/20 rounded-lg inline-block font-bold text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/50 transition-colors hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">
                {user.score} pts
            </div>

        </div>
    );
}

export default PodiumCard;