import { Trophy, Medal, Award } from "lucide-react";

function PodiumCard({ user, rank }) {

    const solved =
        (Number(user.total_easy) || 0) +
        (Number(user.total_medium) || 0) +
        (Number(user.total_hard) || 0);

    const getIcon = () => {
        if (rank === 1) return <Trophy className="w-14 h-14 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-12 h-12 text-gray-400" />;
        return <Award className="w-12 h-12 text-orange-500" />;
    };

    return (
        <div className={`p-6 rounded-xl text-center shadow-md
            ${rank === 1 ? "scale-110 bg-yellow-100" : "bg-gray-100"}
        `}>

            <div className="mb-4">{getIcon()}</div>

            <img
                src={user.profileimage}
                className="w-20 h-20 rounded-full mx-auto mb-3"
            />

            <h3 className="font-bold text-lg">{user.name}</h3>

            <div className="text-2xl font-bold mt-2 text-orange-500">
                {solved}
            </div>

            <p className="text-sm text-gray-500">Solved</p>

            <div className="mt-2 font-bold text-blue-500">
                {user.score} pts
            </div>

        </div>
    );
}

export default PodiumCard;