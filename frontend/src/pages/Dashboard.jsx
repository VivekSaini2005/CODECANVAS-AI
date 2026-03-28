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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">

      {/* Top Section */}
      <div className="flex xl:flex-row flex-col gap-6">

        {/* Sheets Progress Card */}
        <div className="flex-1 bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] rounded-2xl p-6 dark:bg-gradient-to-br dark:from-[#121622] dark:to-[#1a1f2e] flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#625df5]/15 flex items-center justify-center">
                <BookOpen size={18} className="text-[#625df5]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sheets Progress</h2>
            </div>
            <Link to="/sheets" className="text-[#625df5] text-xs font-semibold flex items-center gap-1 hover:text-[#524de3] transition-colors">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {sheets.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
              No sheets found.
            </div>
          ) : (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-52 pr-1 scrollbar-thin">
              {sheets.map(sheet => {
                const prog = sheetProgress[sheet.id];
                const total = prog?.total ?? 0;
                const solved = prog?.solved ?? 0;
                const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
                const barColor =
                  pct === 100 ? "#10b981" :
                    pct >= 50 ? "#625df5" :
                      pct >= 20 ? "#f59e0b" : "#3b82f6";

                return (
                  <Link key={sheet.id} to={`/sheet/${sheet.id}`} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors truncate max-w-[70%]">
                        {sheet.name}
                      </span>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-2 shrink-0">
                        {total > 0 ? `${solved}/${total}` : "—"} &nbsp;
                        <span style={{ color: barColor }}>{pct}%</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-[#1a1f2e] rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Small Stats Cards */}
        <div className="flex flex-col sm:flex-row xl:flex-col gap-4">

          <div className="flex gap-4">
            {/* Solved Problems */}
            <div className="bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] rounded-2xl p-6 w-40 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-4">
                <CheckCircle2 size={20} className="text-[#10b981]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.totalSolved}</h3>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Solved<br />Problems</p>
              </div>
            </div>

            {/* Day Streak */}
            <div className="bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] rounded-2xl p-6 w-40 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mb-4">
                <Flame size={20} className="text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.currentStreak}</h3>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Day Streak</p>
              </div>
            </div>

            {/* Max Streak */}
            <div className="bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] rounded-2xl p-6 w-40 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-[#ec4899]/10 flex items-center justify-center mb-4">
                <Zap size={20} className="text-[#ec4899]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.maxStreak}</h3>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Max Streak</p>
              </div>
            </div>
          </div>

          {/* Submissions */}
          <div className="bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] rounded-2xl p-6 flex-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                <ArrowUpCircle size={20} className="text-[#3b82f6]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuestions}</h3>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Total Questions</p>
              </div>
            </div>
            {/* <div className="bg-[#10b981]/10 text-[#10b981] text-xs font-bold px-2 py-1 rounded">
              
            </div> */}
          </div>

        </div>

      </div>

      {/* Middle Section */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Activity Analytics */}
        {/* Activity Analytics (Replaced with Heatmap) */}
        <div className={`${isHeatMapExpanded ? 'w-full' : 'flex-[2]'} overflow-hidden flex flex-col transition-all duration-300`}>
          <HeatMap
            heatmap={heatmapData}
            onRefresh={handleRefreshHeatmap}
            isLoading={isLoadingHeatmap}
            isExpanded={isHeatMapExpanded}
            onToggleExpand={() => setIsHeatMapExpanded(!isHeatMapExpanded)}
          />
        </div>

        {/* Topic Strength
        <div className="flex-1 bg-white dark:bg-[#121622] border border-gray-200 dark:border-[#1e2332] rounded-2xl p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">Topic Strength</h3>

          <div className="flex flex-col gap-6 flex-1">
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