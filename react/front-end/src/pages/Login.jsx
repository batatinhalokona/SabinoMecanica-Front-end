import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logoFundo from "../assets/logooficial.png"; // imagem usada como fundo

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailCorreto = "sabino@oficina.com";
    const senhaCorreta = "12345";

    if (form.email === emailCorreto && form.senha === senhaCorreta) {
      const usuario = {
        nome: "Bruno Sabino",
        cargo: "Dono da Oficina",
        email: form.email
      };
      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate("/home");
    }

  };

  return (
    <div
      className="login-background"
      style={{ backgroundImage: `url(${logoFundo})` }}
    >
      <div className="login-overlay">
        <div className="login-box">



          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
            {erro && <p className="erro">{erro}</p>}
            <button type="submit">Entrar</button>
          </form>

          <p className="login-info">
            <strong>Usuário:</strong> sabino@oficina.com <br />
            <strong>Senha:</strong> 12345
          </p>
        </div>
      </div>
    </div>
  );
}
