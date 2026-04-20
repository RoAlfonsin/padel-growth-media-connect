import { useState } from "react"
import { Container, Form, Button, Alert, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import LogoPGM from "../assets/LogoPGM.svg"
import API_URL from "../utils/apiClient"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    telefono: "",
    password: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔄 manejar cambios
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ✅ validación simple
  const validate = () => {
    if (!form.telefono || !form.password) {
      return "Todos los campos son obligatorios"
    }

    if (form.telefono.length !== 10) {
      return "Teléfono inválido"
    }

    return null
  }

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Credenciales incorrectas")
      }

      // 🔐 guardar token
      // localStorage.setItem("token", data.access_token)
      login(data.access_token)

      // 🎉 redirigir
      navigate("/")

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <Image
        src={LogoPGM}
        alt="Logo PGM"
        className="d-block mx-auto mb-3"
        style={{ maxWidth: "100px" }}
      />

      <h5 className="text-center mb-4">Inicia sesión</h5>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="5512345678"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="******"
          />
        </Form.Group>

        <Button
          variant="primary"
          size="sm"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </Button>

        <div className="text-center mt-3">
          <p>
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-decoration-none">
              Regístrate aquí
            </a>
          </p>
        </div>


      </Form>
    </Container>
  )
}

export default Login