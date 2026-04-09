import { useState, useEffect } from "react"
import { fetchDashboardStats, fetchSheets, fetchSheetProblems, fetchSolvedProblemIds } from "../api/progressApi"
import { fetchUserHeatmap, fetchUserPlatformStats, syncUserPlatformStats } from "../api/platformStatsApi"
import { CheckCircle2, Flame, ArrowUpCircle, Play, ArrowRight, BookOpen, Zap } from "lucide-react"
import HeatMap from "../components/HeatMap"
import { Link } from "react-router-dom"
import RecentProblems from "../components/RecentProblem"
import RecommendedProblems from "../components/Recommended"
import { calculateStreak, calculateLongestStreak } from "../utils/streakCalculator"

function Dashboard() {
  const [stats, setStats] = useState({
    totalSolved: 0,
    sheetsCompleted: 0,
    currentStreak: 0,
    maxStreak: 0,
    submissions: 0,
    totalQuestions: 0
  });

  const [heatmapData, setHeatmapData] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [sheetProgress, setSheetProgress] = useState({});
  const [isLoadingHeatmap, setIsLoadingHeatmap] = useState(false);
  const [isHeatMapExpanded, setIsHeatMapExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardStats();

        setStats(prev => ({ ...prev, ...data }));

        const heatmap = await fetchUserHeatmap();
        setHeatmapData(heatmap);

        // Calculate both current and longest streak from heatmap data
        const currentStreak = calculateStreak(heatmap);
        const maxStreak = calculateLongestStreak(heatmap);
        setStats(prev => ({ ...prev, currentStreak, maxStreak }));
      } catch (error) {
        console.error("Failed to fetch dashboard stats or heatmap", error);
      }
    };

    const loadPlatformStats = async () => {
      try {
        const data = await fetchUserPlatformStats();

        const totalQuestions = (data.leetcode?.totalSolved || 0) + (data.codeforces?.solved || 0) + (data.codechef?.totalSolved || 0);

        setStats(prev => ({ ...prev, ...data, totalQuestions }));

      } catch (error) {
        console.error("Failed to fetch platform stats", error);
      }
    }

    const loadSheets = async () => {
      try {
        const [allSheets, solvedIds] = await Promise.all([
          fetchSheets(),
          fetchSolvedProblemIds()
        ]);
        setSheets(allSheets);

        // Fetch problems for each sheet and compute progress
        const progressMap = {};
        await Promise.all(
          allSheets.map(async (sheet) => {
            try {
              const problems = await fetchSheetProblems(sheet.id);
              const total = problems.length;
              const solved = problems.filter(p => solvedIds.has(p.id)).length;
              progressMap[sheet.id] = { total, solved };
            } catch {
              progressMap[sheet.id] = { total: 0, solved: 0 };
            }
          })
        );
        setSheetProgress(progressMap);
      } catch (error) {
        console.error("Failed to fetch sheets", error);
      }
    };

    // Check if user is logged in before fetching
    if (localStorage.getItem('token')) {
      fetchData();
      loadPlatformStats();
      loadSheets();
    }
  }, []);

  // Refresh heatmap data and recalculate streak
  const handleRefreshHeatmap = async () => {
    setIsLoadingHeatmap(true);
    try {
      // First sync platforms
      await syncUserPlatformStats();
      
      // Then fetch the latest heatmap data
      const heatmap = await fetchUserHeatmap();
      setHeatmapData(heatmap);
      
      // And the latest platform stats
      const data = await fetchUserPlatformStats();
      const totalQuestions = (data.leetcode?.totalSolved || 0) + (data.codeforces?.solved || 0) + (data.codechef?.totalSolved || 0);

      // Recalculate both current and longest streak with new data
      const currentStreak = calculateStreak(heatmap);
      const maxStreak = calculateLongestStreak(heatmap);
      setStats(prev => ({ ...prev, currentStreak, maxStreak, totalQuestions }));
    } catch (error) {
      console.error("Failed to refresh heatmap data", error);
    } finally {
      setIsLoadingHeatmap(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto pb-10 pt-4">

      {/* Top Section */}
      <div className="flex xl:flex-row flex-col gap-4 sm:gap-6 md:gap-8">

        {/* Sheets Progress Card */}
        <div className="flex-1 glass border border-gray-200 dark:border-white/5 rounded-2xl p-4 sm:p-6 md:p-8 dark:bg-gradient-to-br dark:from-white/5 dark:to-transparent flex flex-col shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <BookOpen size={20} className="text-[#625df5] dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sheets Progress</h2>
            </div>
            <Link to="/sheets" className="text-[#625df5] dark:text-indigo-400 text-sm font-semibold flex items-center gap-1 hover:text-[#524de3] transition-colors">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {sheets.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
              No sheets found.
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-64 pr-2 scrollbar-thin">
              {sheets.map(sheet => {
                const prog = sheetProgress[sheet.id];
                const total = prog?.total ?? 0;
                const solved = prog?.solved ?? 0;
                const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

                return (
                  <Link key={sheet.id} to={`/sheet/${sheet.id}`} className="group block p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all duration-300 border border-transparent dark:hover:border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#625df5] dark:group-hover:text-indigo-400 transition-colors truncate max-w-[65%]">
                        {sheet.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                          {total > 0 ? `${solved}/${total}` : "—"}
                        </span>
                        <span className="text-[11px] font-bold text-[#625df5] dark:text-indigo-300 bg-indigo-50 dark:bg-white/5 px-2 py-1 rounded-md shadow-sm border border-transparent dark:border-white/5 group-hover:dark:border-indigo-500/20 transition-colors">
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-[#0b0f1a] rounded-full h-3 shadow-inner">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500 relative"
                        style={{ width: `${pct}%` }}
                      >
                        {pct > 0 && (
                          <div className="absolute inset-0 bg-white/20 rounded-full" style={{ mixBlendMode: 'overlay' }}></div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Small Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
            {/* Solved Problems */}
            <div className="glass border border-gray-200 dark:border-white/5 rounded-2xl p-4 sm:p-6 md:p-8 w-full flex flex-col justify-between dark:bg-gradient-to-br dark:from-white/5 dark:to-transparent shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={24} className="text-[#10b981]" />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stats.totalSolved}</h3>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Solved<br />Problems</p>
              </div>
            </div>

            {/* Day Streak */}
            <div className="glass border border-gray-200 dark:border-white/5 rounded-2xl p-4 sm:p-6 md:p-8 w-full flex flex-col justify-between dark:bg-gradient-to-br dark:from-white/5 dark:to-transparent shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Flame size={24} className="text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stats.currentStreak}</h3>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Day Streak</p>
              </div>
            </div>

            {/* Max Streak */}
            <div className="glass border border-gray-200 dark:border-white/5 rounded-2xl p-4 sm:p-6 md:p-8 w-full flex flex-col justify-between dark:bg-gradient-to-br dark:from-white/5 dark:to-transparent shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/10 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <Zap size={24} className="text-[#ec4899]" />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stats.maxStreak}</h3>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Max Streak</p>
              </div>
            </div>
          {/* Submissions */}
          <div className="glass border border-gray-200 dark:border-white/5 rounded-2xl p-4 sm:p-6 md:p-8 flex-1 flex items-center justify-between dark:bg-gradient-to-br dark:from-white/5 dark:to-transparent shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <ArrowUpCircle size={24} className="text-[#3b82f6]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalQuestions}</h3>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Total Questions</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Middle Section */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">

        {/* Activity Analytics */}
        {/* Activity Analytics (Replaced with Heatmap) */}
        <div className={`${isHeatMapExpanded ? 'w-auto' : 'flex-[2]'} overflow-x-auto overflow-y-hidden flex flex-col transition-all duration-300`}>
          <HeatMap
            heatmap={heatmapData}
            onRefresh={handleRefreshHeatmap}
            isLoading={isLoadingHeatmap}
            isExpanded={isHeatMapExpanded}
            onToggleExpand={() => setIsHeatMapExpanded(!isHeatMapExpanded)}
          />
        </div>

        {/* Topic Strength
        <div className="flex-1 bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">Topic Strength</h3>

          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 flex-1">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Graphs</span>
                <span className="text-sm font-medium text-gray-500">85%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#1a1f2e] rounded-full h-2">
                <div className="bg-[#625df5] h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">DP</span>
                <span className="text-sm font-medium text-gray-500">42%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#1a1f2e] rounded-full h-2">
                <div className="bg-[#45b7f1] h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Arrays</span>
                <span className="text-sm font-medium text-gray-500">92%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#1a1f2e] rounded-full h-2">
                <div className="bg-[#10b981] h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#1e2332] text-center">
            <span className="text-[10px] font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">AI Tip: Focus on Dynamic Programming</span>
          </div>
        </div> */}
        
        {!isHeatMapExpanded && (
          <div className="flex-1 overflow-hidden transition-all duration-300 flex flex-col min-w-0">
            <RecommendedProblems />
          </div>
        )}

      </div>

      {/* Recent Section */}
      <RecentProblems />


    </div>
  )
}

export default Dashboard