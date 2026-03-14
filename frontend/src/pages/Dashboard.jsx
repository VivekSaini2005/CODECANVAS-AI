import { useState, useEffect } from "react"
import API from "../services/api"
import StatCard from "../components/StatCard"

function Dashboard(){

  const [stats, setStats] = useState({
    problemsSolved: 0,
    sheetsCompleted: 0,
    currentStreak: 0,
    submissions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/progress/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    
    // Check if user is logged in before fetching
    if (localStorage.getItem('token')) {
      fetchStats();
    }
  }, []);

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">

        <StatCard title="Problems Solved" value={stats.problemsSolved}/>
        <StatCard title="Sheets Completed" value={stats.sheetsCompleted}/>
        <StatCard title="Current Streak" value={stats.currentStreak}/>
        <StatCard title="Submissions" value={stats.submissions}/>

      </div>

    </div>

  )

}

export default Dashboard