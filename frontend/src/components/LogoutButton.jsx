import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"

function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="text-end mt-3">
      <Button variant="outline-secondary" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  )
}

export default LogoutButton