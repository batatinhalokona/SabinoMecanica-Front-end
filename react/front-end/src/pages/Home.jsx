import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTools, FaUsers, FaWarehouse, FaCamera } from "react-icons/fa";
import "./Home.css";
import logoHome from "../assets/logohome.png"; // tua logo

export default function Home() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="home-container">
      {/* ======= TOPO ======= */}
      <header className="home-header">
        <img src={logoHome} alt="Logo Oficina Sabino" className="logo-home" />
        <div className="home-user">
          <p>
            Bem-vindo, <strong>{usuario.nome}</strong>!
          </p>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>

      {/* ======= CARDS ======= */}
      <main className="home-main">
        <div className="card" onClick={() => navigate("/servicos")}>
          <h2>
            <FaTools /> Serviços
          </h2>
          <p>Gerencie serviços, descrições, valores e datas.</p>
        </div>

        <div className="card" onClick={() => navigate("/clientes")}>
          <h2>
            <FaUsers /> Clientes
          </h2>
          <p>Cadastre e mantenha o controle dos clientes.</p>
        </div>

        <div className="card" onClick={() => navigate("/estoque")}>
          <h2>
            <FaWarehouse /> Estoque
          </h2>
          <p>Peças novas, usadas e óleo em um só lugar.</p>
        </div>

        <div className="card" onClick={() => navigate("/registro")}>
          <h2>
            <FaCamera /> Registro
          </h2>
          <p>Fotos e anotações rápidas dos serviços.</p>
        </div>
      </main>
    </div>
  );
}
