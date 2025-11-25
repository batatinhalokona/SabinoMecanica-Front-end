import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaUsers,
  FaClipboardList,
  FaBoxes,
  FaCarSide,
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  // Lista de serviços em andamento
  const [servicosAndamento, setServicosAndamento] = useState([]);

  // Carrega serviços em andamento do localStorage
  useEffect(() => {
    try {
      const lista = JSON.parse(localStorage.getItem("servicos") || "[]");

      const filtrados = lista.filter(
        (s) =>
          s.status === "andamento" ||
          s.status === "EM_ANDAMENTO" ||
          s.status === "Em Andamento"
      );

      // Se quiser mostrar só alguns, pode cortar:
      // setServicosAndamento(filtrados.slice(0, 5));
      setServicosAndamento(filtrados);
    } catch (e) {
      console.error("Erro ao ler serviços do localStorage:", e);
      setServicosAndamento([]);
    }
  }, []);

  return (
    <div className="home-container">
      <div className="home-content page-transition-side">
        {/* Cabeçalho */}
        <header className="home-header">
          <h1>Oficina Sabino</h1>
          <p>Painel principal de controle da oficina.</p>
        </header>

        {/* Grid de cards */}
        <div className="home-grid">
          {/* 1 - Serviços */}
          <div className="home-card" onClick={() => navigate("/servicos")}>
            <FaTools className="icone-card-home" />
            <h2>Serviços</h2>
            <p>Acompanhe os serviços em andamento, garantia e histórico.</p>
          </div>

          {/* 2 - Clientes */}
          <div className="home-card" onClick={() => navigate("/clientes")}>
            <FaUsers className="icone-card-home" />
            <h2>Clientes</h2>
            <p>Gerencie o cadastro e situação dos clientes.</p>
          </div>

          {/* 3 - Carros */}
          <div className="home-card" onClick={() => navigate("/carros")}>
            <FaCarSide className="icone-card-home" />
            <h2>Carros</h2>
            <p>Cadastre e consulte os veículos dos clientes.</p>
          </div>

          {/* 4 - Registro Técnico */}
          <div className="home-card" onClick={() => navigate("/registro")}>
            <FaClipboardList className="icone-card-home" />
            <h2>Registro Técnico</h2>
            <p>Salve fotos, medidas e observações de motores.</p>
          </div>

          {/* 5 - Estoque */}
          <div className="home-card" onClick={() => navigate("/estoque")}>
            <FaBoxes className="icone-card-home" />
            <h2>Estoque</h2>
            <p>Controle peças, produtos e quantidades.</p>
          </div>
        </div>

        {/* ==========================
            PAINEL DE SERVIÇOS EM ANDAMENTO
        =========================== */}
        <section className="home-servicos-section">
          <h2>🔧 Serviços em andamento</h2>
          <p className="home-servicos-descricao">
            Visão rápida dos veículos que estão na oficina neste momento.
          </p>

          {servicosAndamento.length === 0 ? (
            <p className="texto-vazio-home">
              Nenhum serviço em andamento no momento.
            </p>
          ) : (
            <div className="home-servicos-lista">
              {servicosAndamento.map((s) => (
                <div key={s.id || s.codigo || Math.random()} className="home-servico-card">
                  <div className="home-servico-header">
                    <strong>
                      {/* tenta vários nomes possíveis do backend/front */}
                      {s.cliente ||
                        s.nomeCliente ||
                        s.clienteNome ||
                        "Cliente não informado"}
                    </strong>
                    <span className="home-servico-status">
                      {s.status || "andamento"}
                    </span>
                  </div>

                  <div className="home-servico-linha">
                    <span>
                      🚗{" "}
                      {s.carro ||
                        s.veiculo ||
                        s.modelo ||
                        "Veículo não informado"}
                    </span>
                  </div>

                  <div className="home-servico-linha">
                    <span>
                      🛠️{" "}
                      {s.descricao ||
                        s.servico ||
                        s.tipoServico ||
                        "Serviço não descrito"}
                    </span>
                  </div>

                  {s.data && (
                    <div className="home-servico-linha">
                      <span>📅 {s.data}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
