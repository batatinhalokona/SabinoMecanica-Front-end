import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Faz o login (apenas o dono da oficina)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui você define seu e-mail e senha fixos
    const emailCorreto = "sabino@oficina.com";
    const senhaCorreta = "12345";

    if (form.email === emailCorreto && form.senha === senhaCorreta) {
      const usuario = { nome: "Bruno Sabino", cargo: "Dono", email: form.email };
      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate("/home"); // Redireciona para o painel principal
    } else {
      setErro("E-mail ou senha incorretos!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🔧 Oficina Sabino</h1>
        <p className="login-subtitle">Acesso restrito ao gerente</p>

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
  );
}
