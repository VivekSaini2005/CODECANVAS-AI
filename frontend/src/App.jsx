import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "./layout/MainLayout"

import Dashboard from "./pages/Dashboard"
import Sheets from "./pages/Sheets"
import SheetProblems from "./pages/SheetProblems"
import Problem from "./pages/Problem"

function App() {

  return (
    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route path="/" element={<Dashboard />} />
          <Route path="/sheets" element={<Sheets />} />
          <Route path="/sheet/:id" element={<SheetProblems />} />
          <Route path="/problem/:slug" element={<Problem />} />

        </Routes>

      </MainLayout>

    </BrowserRouter>
  )

}

export default App