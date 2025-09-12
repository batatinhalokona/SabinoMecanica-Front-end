// Importa os hooks do React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importa o CSS específico da tela de login
import "./Login.css";

// Componente de Login
export default function Login() {
  // Estados para guardar os valores dos campos de email e senha
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Estado para exibir mensagens de erro (ex: login inválido)
  const [erro, setErro] = useState("");

  // Hook de navegação para redirecionar o usuário
  const navigate = useNavigate();

  // Função executada ao clicar no botão de login
  const handleLogin = async (e) => {
    e.preventDefault(); // Previne o reload da página
    setErro("");        // Limpa o erro anterior

    try {
      // Faz uma requisição GET para buscar usuários com esse email e senha
      const response = await axios.get("http://localhost:3000/usuarios", {
        params: { email, senha },
      });

      // Se encontrou algum usuário válido
      if (response.data.length > 0) {
        const usuarioLogado = response.data[0];

        // Salva o usuário no localStorage para manter o login ativo
        localStorage.setItem("usuario", JSON.stringify(usuarioLogado));

        // Redireciona para a tela Home
        navigate("/home");
      } else {
        // Caso o email ou senha estejam incorretos
        setErro("Email ou senha inválidos");
      }
    } catch (err) {
      setErro("Erro ao tentar fazer login");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* Formulário de Login */}
      <form className="login-form" onSubmit={handleLogin}>
        {/* Campo de Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Campo de Senha */}
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {/* Botão de Entrar */}
        <button type="submit">Entrar</button>

        {/* Exibe a mensagem de erro (se houver) */}
        {erro && <p className="login-error">{erro}</p>}
      </form>
    </div>
  );
}
