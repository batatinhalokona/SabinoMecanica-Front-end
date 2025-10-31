import React from "react";
import { useNavigate } from "react-router-dom";
import "./Estoque.css";

export default function Estoque() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Se não estiver logado, volta pro login
  if (!usuario) {
    navigate("/");
    return null;
  }

  return (
    <div className="estoque-container">
      {/* Cabeçalho */}
      <header className="estoque-header">
        <h1>⚙️ Estoque da Oficina Sabino</h1>
        <p>Gerencie suas peças e óleos com praticidade.</p>
      </header>

      {/* Cards clicáveis */}
      <div className="estoque-cards">
        <div className="card" onClick={() => navigate("/estoque/novas")}>
          <h2>🔩 Peças Novas</h2>
          <p>Cadastre e controle as peças novas disponíveis em estoque.</p>
        </div>

        <div className="card" onClick={() => navigate("/estoque/usadas")}>
          <h2>⚙️ Peças Usadas</h2>
          <p>Gerencie as peças usadas ou recondicionadas.</p>
        </div>

        <div className="card" onClick={() => navigate("/estoque/oleo")}>
          <h2>🛢️ Óleo</h2>
          <p>Controle o estoque de óleos novos e recicláveis.</p>
        </div>
      </div>
    </div>
  );
}
