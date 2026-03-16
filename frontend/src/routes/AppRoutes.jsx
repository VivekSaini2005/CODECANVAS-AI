import { BrowserRouter,Routes,Route } from "react-router-dom"

import Problem from "../pages/Problem"
import ProblemWorkspace from "../pages/ProblemWorkspace"

function AppRoutes(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/problem/:slug" element={<Problem/>}/>

        <Route
          path="/workspace/:slug"
          element={<ProblemWorkspace/>}
        />

      </Routes>

    </BrowserRouter>

  )

}

export default AppRoutes