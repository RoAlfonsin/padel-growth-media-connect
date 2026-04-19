import { useState } from "react"
import { Container, Form, Button, Alert, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import LogoPGM from "../assets/LogoPGM.svg"

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    password: "",
    nivel: "5ta"
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
    if (!form.nombre || !form.telefono || !form.password) {
      return "Todos los campos son obligatorios"
    }

    if (form.telefono.length != 10) {
      return "Teléfono inválido"
    }

    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
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

      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "Error al registrarse")
      }

      // 🎉 éxito
      navigate("/login")

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <Image src={LogoPGM} alt="Logo PGM" className="d-block mx-auto mb-3" style={{maxWidth: "100px"}}/>
      <h5 className="d-block mb-4 text-center">Regístrate para jugar con la mejor comunidad</h5>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
          />
        </Form.Group>

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

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="******"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Nivel</Form.Label>
          <Form.Select
            name="nivel"
            value={form.nivel}
            onChange={handleChange}
          >
            <option value="5ta">5ta</option>
            <option value="4ta">4ta</option>
            <option value="3ra">3ra</option>
            <option value="2da">2da</option>
            <option value="1ra">1ra</option>
          </Form.Select>
        </Form.Group>

        <Button
          variant="primary"
          size="sm"
          type="submit"
          className="w-100 mx-auto d-block"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </Button>

      </Form>
    </Container>
  )
}

export default Register