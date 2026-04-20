import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function ProtectedRoute({ children }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoute