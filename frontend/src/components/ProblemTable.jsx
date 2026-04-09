import { Link } from "react-router-dom"

function ProblemTable({ problems }) {

  return (
    <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-gradient-to-br dark:from-white/5 dark:to-transparent shadow-soft overflow-hidden glass before:absolute before:inset-0 before:bg-black/5 dark:before:bg-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none mt-4 group">
      <table className="relative z-10 w-full">

        <thead>

          <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 backdrop-blur-md sticky top-0 z-10">

            <th className="px-6 py-3 font-medium">Problem</th>
            <th className="px-6 py-3 font-medium">Difficulty</th>
            <th className="px-6 py-3 font-medium">Platform</th>

          </tr>

        </thead>

        <tbody>

          {problems.map(p => (

            <tr key={p.id} className="group border-b border-gray-100 dark:border-white/5 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:scale-[1.005] hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-all duration-200 relative hover:z-10">

              <td className="px-6 py-4">

                <Link
                  to={`/problem/${p.slug}`}
                  className="font-medium hover:text-[#625df5] dark:hover:text-indigo-400 transition-colors"
                >
                  {p.title}
                </Link>

              </td>

              <td className="px-6 py-4">{p.difficulty}</td>

              <td className="px-6 py-4">{p.platform}</td>

            </tr>

          ))}

        </tbody>

      </table>
    </div>
  )

}

export default ProblemTable