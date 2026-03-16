import { useState, useEffect } from "react"
import { fetchDashboardStats } from "../api/progressApi"
import { fetchUserHeatmap } from "../api/platformStatsApi"
import { CheckCircle2, Flame, ArrowUpCircle, Play, ArrowRight } from "lucide-react"
import HeatMap from "../components/HeatMap"

function Dashboard() {
  const [stats, setStats] = useState({
    totalSolved: 0,
    sheetsCompleted: 0,
    currentStreak: 0,
    submissions: 128 // Mocked since it doesn't come from API currently
  });
  
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(prev => ({ ...prev, ...data }));
        
        const heatmap = await fetchUserHeatmap();
        setHeatmapData(heatmap);
      } catch (error) {
        console.error("Failed to fetch dashboard stats or heatmap", error);
      }
    };
    
    // Check if user is logged in before fetching
    if (localStorage.getItem('token')) {
      fetchData();
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">

      {/* Top Section */}
      <div className="flex xl:flex-row flex-col gap-6">
        
        {/* Welcome Card */}
        <div className="flex-1 bg-[#121622] border border-[#1e2332] rounded-2xl p-8 flex justify-between items-center bg-gradient-to-br from-[#121622] to-[#1a1f2e]">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-3">
              Welcome back, <span className="text-[#625df5]">Alex</span>! 👋
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              You're on a roll! Maintain your streak to unlock the 'Elite Coder' badge by the end of this month.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#625df5] hover:bg-[#524de3] text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm">
                Resume Learning
              </button>
              <button className="bg-[#1e2332] hover:bg-[#252b3d] text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm border border-[#2a3045]">
                View Roadmap
              </button>
            </div>
          </div>

          <div className="hidden sm:block">
            {/* Goal Circle */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="#1e2332" strokeWidth="12" />
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="#625df5" strokeWidth="12" strokeDasharray="351" strokeDashoffset="87.75" className="drop-shadow-lg" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-white">75%</span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Monthly Goal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small Stats Cards */}
        <div className="flex flex-col sm:flex-row xl:flex-col gap-4">
          
          <div className="flex gap-4">
            {/* Solved Problems */}
            <div className="bg-[#121622] border border-[#1e2332] rounded-2xl p-6 w-40 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4">
                <CheckCircle2 size={20} className="text-[#10b981]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">{stats.totalSolved}</h3>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Solved<br/>Problems</p>
              </div>
            </div>

            {/* Day Streak */}
            <div className="bg-[#121622] border border-[#1e2332] rounded-2xl p-6 w-40 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                <Flame size={20} className="text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1">{stats.currentStreak}</h3>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Submissions */}
          <div className="bg-[#121622] border border-[#1e2332] rounded-2xl p-6 flex-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                <ArrowUpCircle size={20} className="text-[#3b82f6]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{stats.submissions}</h3>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Total Submissions</p>
              </div>
            </div>
            <div className="bg-[#10b981]/10 text-[#10b981] text-xs font-bold px-2 py-1 rounded">
              +12.4%
            </div>
          </div>

        </div>

      </div>

      {/* Middle Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Activity Analytics */}
        {/* Activity Analytics (Replaced with Heatmap) */}
        <div className="flex-[2] overflow-hidden">
          <HeatMap heatmap={heatmapData} />
        </div>

        {/* Topic Strength */}
        <div className="flex-1 bg-[#121622] border border-[#1e2332] rounded-2xl p-6 flex flex-col">
          <h3 className="font-bold text-white text-lg mb-6">Topic Strength</h3>
          
          <div className="flex flex-col gap-6 flex-1">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Graphs</span>
                <span className="text-sm font-medium text-gray-500">85%</span>
              </div>
              <div className="w-full bg-[#1a1f2e] rounded-full h-2">
                <div className="bg-[#625df5] h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">DP</span>
                <span className="text-sm font-medium text-gray-500">42%</span>
              </div>
              <div className="w-full bg-[#1a1f2e] rounded-full h-2">
                <div className="bg-[#45b7f1] h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Arrays</span>
                <span className="text-sm font-medium text-gray-500">92%</span>
              </div>
              <div className="w-full bg-[#1a1f2e] rounded-full h-2">
                <div className="bg-[#10b981] h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1e2332] text-center">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">AI Tip: Focus on Dynamic Programming</span>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white text-xl">Continue Solving</h3>
          <button className="text-[#625df5] text-sm font-semibold flex items-center gap-1 hover:text-[#524de3]">
            View History <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-[#121622] border border-[#1e2332] rounded-2xl p-5 hover:border-[#625df5]/50 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#f59e0b]/10 text-[#f59e0b] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">Medium</span>
              <div className="w-8 h-8 rounded-full bg-[#1a1f2e] flex items-center justify-center group-hover:bg-[#625df5] group-hover:text-white transition-colors text-gray-400">
                <Play size={14} className="ml-1" />
              </div>
            </div>
            <h4 className="text-white font-bold text-lg mb-3">Longest Palindromic Substring</h4>
            <div className="flex gap-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1">⏱ 2 days ago</span>
              <span className="flex items-center gap-1">📈 38% accuracy</span>
              <span className="flex gap-1 ml-auto">
                <span className="bg-[#1a1f2e] px-2 py-0.5 rounded text-[10px]">STRING</span>
                <span className="bg-[#1a1f2e] px-2 py-0.5 rounded text-[10px]">DP</span>
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#121622] border border-[#1e2332] rounded-2xl p-5 hover:border-[#625df5]/50 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#10b981]/10 text-[#10b981] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">Easy</span>
              <div className="w-8 h-8 rounded-full bg-[#1a1f2e] flex items-center justify-center group-hover:bg-[#625df5] group-hover:text-white transition-colors text-gray-400">
                <Play size={14} className="ml-1" />
              </div>
            </div>
            <h4 className="text-white font-bold text-lg mb-3">Valid Parentheses</h4>
            <div className="flex gap-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1">⏱ 1 week ago</span>
              <span className="flex items-center gap-1">📈 72% accuracy</span>
              <span className="flex gap-1 ml-auto">
                <span className="bg-[#1a1f2e] px-2 py-0.5 rounded text-[10px]">STACK</span>
                <span className="bg-[#1a1f2e] px-2 py-0.5 rounded text-[10px]">STRING</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard