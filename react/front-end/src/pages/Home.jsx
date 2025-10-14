import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  // Função para sair (logout)
  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Remove o usuário salvo
    navigate("/login"); // Redireciona para o login
  };

  return (
    <div className="home-container">
      {/* Botão de Logout no topo */}
      <button className="logout-btn" onClick={handleLogout}>
        🚪 Sair
      </button>

      <h1>🏠 Painel da Oficina Sabino</h1>
      <p>Bem-vindo! Escolha uma área para gerenciar:</p>

      <div className="home-menu">
        <Link to="/servicos" className="home-card servico-card">
          <h2>🧰 Serviços</h2>
          <p>Gerencie serviços em andamento, garantias e históricos.</p>
        </Link>

        <Link to="/clientes" className="home-card cliente-card">
          <h2>👤 Clientes</h2>
          <p>Acompanhe os clientes, pendentes e históricos de atendimento.</p>
        </Link>

        <Link to="/registro" className="home-card registro-card">
          <h2>📋 Registro</h2>
          <p>Cadastre novos clientes, serviços e carros.</p>
        </Link>
      </div>
    </div>
  );
}
