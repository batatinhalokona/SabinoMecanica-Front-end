import React from "react";
import { useNavigate } from "react-router-dom";
import "./Clientes.css";

// ATENÇÃO: agora o caminho está CORRETO (sobe duas pastas)
import clienteImg from "../../assets/clientes-vintage.png";

export default function Clientes() {
  const navigate = useNavigate();

  return (
    <div className="clientes-root">
      {/* ------------------ CABEÇALHO ------------------ */}
      <header className="clientes-header">
        <h1 className="clientes-titulo">👥 Clientes da Oficina Sabino</h1>
        <p className="clientes-subtitulo">
          Gerencie cadastros, contatos, pendências e histórico de atendimento.
        </p>
      </header>

      {/* ------------------ CONTEÚDO ------------------ */}
      <main className="clientes-main">
        {/* ======== IMAGEM LADO ESQUERDO ======== */}
        <div className="clientes-img-container">
          <img
            src={clienteImg}
            alt="Ilustração de cliente da oficina"
            className="clientes-img"
          />
        </div>

        {/* ======== CARDS LADO DIREITO ======== */}
        <section className="clientes-cards-container">
          <div className="clientes-card" onClick={() => navigate("/clientes")}>
            <h2>🔧 Clientes em Atendimento</h2>
            <p>Veja os clientes que possuem serviços em execução.</p>
          </div>

          <div className="clientes-card" onClick={() => navigate("/clientes")}>
            <h2>💰 Clientes Pendentes</h2>
            <p>Clientes com serviços ou pagamentos em aberto/atraso.</p>
          </div>

          <div className="clientes-card" onClick={() => navigate("/clientes")}>
            <h2>📜 Histórico de Clientes</h2>
            <p>Visualize atendimentos finalizados e serviços anteriores.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
