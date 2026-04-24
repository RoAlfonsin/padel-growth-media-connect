import { useEffect, useState } from "react"
import { Container, Form, Button, Alert, Card } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { fetchWithAuth } from "../utils/apiClient"
import { useAuth } from "../hooks/useAuth"

function AddClub() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    direccion_url: "",
    logo_url: "",
    pgm_profile_url: ""
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // 🔒 Protección: solo Master puede acceder
  useEffect(() => {
    if (user && user.rol !== "master") {
      navigate("/")
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error de validación al editar
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validate = () => {
    const errors = {}

    if (!form.nombre.trim()) {
      errors.nombre = "El nombre del club es obligatorio"
    }

    if (!form.direccion.trim()) {
      errors.direccion = "La dirección es obligatoria"
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      setLoading(true)

      const payload = {
        nombre: form.nombre.trim(),
        direccion: form.direccion.trim(),
        ...(form.direccion_url && { direccion_url: form.direccion_url }),
        ...(form.logo_url && { logo_url: form.logo_url }),
        ...(form.pgm_profile_url && { pgm_profile_url: form.pgm_profile_url })
      }

      const res = await fetchWithAuth("/clubs", {
        method: "POST",
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      setSuccess(`Club "${data.nombre}" creado exitosamente`)
      setForm({
        nombre: "",
        direccion: "",
        direccion_url: "",
        logo_url: "",
        pgm_profile_url: ""
      })

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/")
      }, 2000)

    } catch (err) {
      setError(err.message || "Error al crear el club")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container style={{ maxWidth: "500px" }} className="mt-4">
      <h5 className="mb-3">Agregar Club</h5>  
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Campo: Nombre */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Nombre del Club *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej: Club Padel Sport"
                isInvalid={!!validationErrors.nombre}
              />
              {validationErrors.nombre && (
                <Form.Control.Feedback type="invalid">
                  {validationErrors.nombre}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Campo: Dirección */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Dirección *</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Ej: Calle Principal 123, Ciudad"
                isInvalid={!!validationErrors.direccion}
              />
              {validationErrors.direccion && (
                <Form.Control.Feedback type="invalid">
                  {validationErrors.direccion}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Campo: URL de Dirección (Google Maps, etc.) */}
            <Form.Group className="mb-3">
              <Form.Label>URL de Ubicación (Google Maps, etc.)</Form.Label>
              <Form.Control
                type="url"
                name="direccion_url"
                value={form.direccion_url}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
              />
              <Form.Text className="text-muted">
                Opcional: Link a Google Maps u otro servicio de ubicación
              </Form.Text>
            </Form.Group>

            {/* Campo: URL del Logo */}
            <Form.Group className="mb-3">
              <Form.Label>URL del Logo</Form.Label>
              <Form.Control
                type="url"
                name="logo_url"
                value={form.logo_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/logo.png"
              />
              <Form.Text className="text-muted">
                Opcional: URL del logo o imagen del club
              </Form.Text>
            </Form.Group>

            {/* Campo: Perfil PadelPro Manager */}
            <Form.Group className="mb-4">
              <Form.Label>Perfil Padel Growth Media</Form.Label>
              <Form.Control
                type="url"
                name="pgm_profile_url"
                value={form.pgm_profile_url}
                onChange={handleChange}
                placeholder="https://padelgrowthmedia.com/club/..."
              />
              <Form.Text className="text-muted">
                Opcional: Link al perfil del club en Padel Growth Media
              </Form.Text>
            </Form.Group>

            {/* Botones */}
            <div className="d-flex gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="flex-grow-1"
              >
                {loading ? "Creando..." : "Crear Club"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AddClub