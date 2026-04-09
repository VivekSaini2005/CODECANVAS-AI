import { Trophy, Medal, Award } from "lucide-react";

function PodiumCard({ user, rank }) {

    const getIcon = () => {
        if (rank === 1) return <Trophy className="text-3xl mb-2 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />;
        if (rank === 2) return <Medal className="text-3xl mb-2 text-gray-300" />;
        return <Award className="text-3xl mb-2 text-orange-400" />;
    };

    const getRankStyles = () => {
        if (rank === 1) return "border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.2)] hover:shadow-[0_0_40px_rgba(250,204,21,0.4)]";
        if (rank === 2) return "border-gray-300/20 hover:shadow-[0_0_30px_rgba(209,213,219,0.15)]";
        return "border-orange-400/20 hover:shadow-[0_0_30px_rgba(251,146,60,0.15)]";
    };

    const getAvatarStyles = () => {
        if (rank === 1) return "border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.4)]";
        return "border-white/10";
    };

    return (
        <div className={`relative w-full md:w-1/3 flex-1 p-3 sm:p-4 md:p-6 rounded-2xl text-center bg-gradient-to-br from-white/5 to-transparent border backdrop-blur-md transition-all duration-300 hover:-translate-y-2 cursor-pointer ${getRankStyles()} ${rank === 1 ? 'scale-105 z-10' : ''}`}>

            <div className="mb-4 flex justify-center drop-shadow-md transition-transform duration-300 hover:rotate-6 hover:scale-110">{getIcon()}</div>

            <img
                src={user.profileimage}
                className={`w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 transition-all duration-300 hover:scale-105 ${getAvatarStyles()}`}
                alt={user.name}
            />

            <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-100 tracking-tight transition-colors hover:text-blue-600 dark:hover:text-blue-400">{user.name}</h3>

            <div className="text-2xl font-bold text-indigo-400 mt-2 drop-shadow-sm transition-transform hover:scale-110">
                {user.total_solved}
            </div>

            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Solved</p>

            <div className="mt-2 px-3 py-1 rounded-lg inline-block font-bold shadow-sm bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 transition-colors">
                {user.score} pts
            </div>

        </div>
    );
}

export default PodiumCard;