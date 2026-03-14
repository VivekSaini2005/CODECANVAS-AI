import StatCard from "../components/StatCard"

function Dashboard(){

  return (

    <div>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">

        <StatCard title="Problems Solved" value="24"/>
        <StatCard title="Sheets Completed" value="2"/>
        <StatCard title="Current Streak" value="5"/>
        <StatCard title="Submissions" value="40"/>

      </div>

    </div>

  )

}

export default Dashboard