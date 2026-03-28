import { Link } from "react-router-dom"

function ProblemTable({ problems }) {

  return (

    <table className="w-full mt-4">

      <thead>

        <tr className="text-left text-gray-500 dark:text-gray-400">

          <th className="p-2">Problem</th>
          <th>Difficulty</th>
          <th>Platform</th>

        </tr>

      </thead>

      <tbody>

        {problems.map(p => (

          <tr key={p.id} className="border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200">

            <td className="p-2">

              <Link
                to={`/problem/${p.slug}`}
                className="hover:text-blue-400"
              >
                {p.title}
              </Link>

            </td>

            <td>{p.difficulty}</td>

            <td>{p.platform}</td>

          </tr>

        ))}

      </tbody>

    </table>

  )

}

export default ProblemTable