import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "./layout/MainLayout"

import Dashboard from "./pages/Dashboard"
import Sheets from "./pages/Sheets"
import SheetProblems from "./pages/SheetProblems"
import Problem from "./pages/Problem"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import SolveProblem from "./pages/SolveProblem"
import ProblemsPage from "./pages/ProblemsPage"
import Leaderboard from "./pages/Leaderboard"
import Discussion from "./pages/Discussion"

function App() {

  return (
    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route path="/" element={<Dashboard />} />
          <Route path="/sheets" element={<Sheets />} />
          <Route path="/sheet/:id" element={<SheetProblems />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/discuss" element={<Discussion />} />
          <Route path="/problem/:slug" element={<Problem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/solve/:problemId" element={<SolveProblem />} />
        </Routes>

      </MainLayout>

    </BrowserRouter>
  )

}

export default App