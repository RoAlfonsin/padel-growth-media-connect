import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Retas from "./pages/Retas"
import RetaDetail from "./pages/RetaDetail"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Retas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/retas/:id" element={<RetaDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App