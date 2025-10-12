import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("/login", { email, senha });
      if (response && response.data) {
        const usuarioLogado = response.data.usuario || response.data;
        localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
        navigate("/home");
        return;
      }
    } catch (err) {
      console.warn("API de login indisponível, usando fallback:", err?.message || err);
      if (email === "admin" && senha === "123") {
        const usuarioLogado = { id: 0, nome: "Administrador (mock)", email };
        localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
        navigate("/home");
        return;
      }
      setErro("Email ou senha inválidos (e backend indisponível).");
    }
  };

  return (
    <div className="login-container">
      <h1>Entrar</h1>
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} required />

        <label>Senha</label>
        <input type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} required />

        <button type="submit">Entrar</button>
        {erro && <p className="login-error">{erro}</p>}
      </form>
    </div>
  );
}
