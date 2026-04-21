import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Retas from "./pages/Retas"
import CreateReta from "./pages/CreateReta"
import RetaDetail from "./pages/RetaDetail"
import Jugadores from "./pages/Jugadores"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          {<Route path="/" element={<Retas />} />}
          {<Route path="/retas/crear" element={<CreateReta />} />}
          {<Route path="/retas/:id" element={<RetaDetail />} />}
          {<Route path="/jugadores" element={<Jugadores />} />}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App