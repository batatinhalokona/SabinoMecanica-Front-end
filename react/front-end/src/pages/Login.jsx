import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logoFundo from "../assets/logooficial.png"; // sua imagem real da pasta assets

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica de autenticação (mantive simples)
    if (form.email === "sabino@oficina.com" && form.senha === "12345") {
      localStorage.setItem("usuario", JSON.stringify({ nome: "Bruno Sabino", email: form.email }));
      navigate("/home");
    } else {
      setErro("E-mail ou senha incorretos!");
    }
  };

  return (
    <div
      className="login-background"
      // Usar logoFundo importado normalmente:
      style={{ backgroundImage: `url(${logoFundo})` }}
    >
      {/*
        Se quiser testar com a captura que você enviou diretamente (apenas para rodar localmente),
        troque a linha acima por:
        style={{ backgroundImage: `url('/mnt/data/Captura de Tela (23).png')` }}
        OBS: esse caminho funciona apenas em ambientes onde o arquivo esteja disponível naquele path.
      */}
      <div className="login-overlay">
        <div className="login-box">
          <h2 className="login-title">Acessar o Sistema</h2>

          <form onSubmit={handleSubmit} className="login-form">
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

            {erro && <div className="erro">{erro}</div>}

            <button type="submit" className="btn-submit">Entrar</button>
          </form>

          
        </div>
      </div>
    </div>
  );
}
