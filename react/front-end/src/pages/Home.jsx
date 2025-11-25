// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import {
  FaTools,
  FaUsers,
  FaWarehouse,
  FaSignOutAlt,
  FaHome,
  FaClipboardList, // ícone para Registro
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Home.css";

export default function Home() {
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  // carrega todos os serviços do backend
  useEffect(() => {
    const buscarServicos = async () => {
      try {
        const response = await api.get("/api/servicos");
        setServicos(response.data);
        setErro(null);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        setErro("Não foi possível carregar os serviços.");
      }
    };

    buscarServicos();
  }, []);

  // considera em andamento quando data_fim é null
  const servicosEmAndamento = servicos.filter(
    (servico) => servico.data_fim === null
  );

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/"); // ajuste pra /login se for o teu caso
  };

  return (
    <div className="home-page">
      {/* botão de sair no topo direito */}
      <button className="home-logout" onClick={handleLogout}>
        <FaSignOutAlt className="home-logout-icon" />
        <span>Sair</span>
      </button>

      {/* cabeçalho centralizado */}
      <header className="home-header">
        <h1 className="home-title">
          <span className="home-title-icon">
            <FaHome />
          </span>
          Painel da Oficina Sabino
        </h1>
        <p className="home-subtitle">
          Acompanhe os serviços em andamento e acesse as principais áreas da
          oficina.
        </p>
      </header>

      <main className="home-content">
        {/* coluna esquerda: cards de navegação */}
        <section className="home-cards-area">
          {/* Serviços */}
          <div
            className="home-card"
            onClick={() => navigate("/servicos")}
          >
            <div className="home-card-header">
              <span className="home-card-icon">
                <FaTools />
              </span>
              <h2>Serviços</h2>
            </div>
            <p className="home-card-text">
              Gerencie serviços em andamento, concluídos e em garantia.
            </p>
          </div>

          {/* Clientes */}
          <div
            className="home-card"
            onClick={() => navigate("/clientes")}
          >
            <div className="home-card-header">
              <span className="home-card-icon">
                <FaUsers />
              </span>
              <h2>Clientes</h2>
            </div>
            <p className="home-card-text">
              Cadastre e consulte os clientes da Oficina Sabino.
            </p>
          </div>

          {/* Registro */}
          <div
            className="home-card"
            onClick={() => navigate("/registro")}
          >
            <div className="home-card-header">
              <span className="home-card-icon">
                <FaClipboardList />
              </span>
              <h2>Registro</h2>
            </div>
            <p className="home-card-text">
              Registre novos serviços, carros e informações gerais.
            </p>
          </div>

          {/* Estoque */}
          <div
            className="home-card"
            onClick={() => navigate("/estoque")}
          >
            <div className="home-card-header">
              <span className="home-card-icon">
                <FaWarehouse />
              </span>
              <h2>Estoque</h2>
            </div>
            <p className="home-card-text">
              Visualize peças novas, usadas e óleos disponíveis.
            </p>
          </div>
        </section>

        {/* coluna direita: serviços em andamento */}
        <section className="home-servicos-area">
          <h2 className="home-servicos-titulo">Serviços em andamento</h2>

          {erro && <p className="home-erro">{erro}</p>}

          {!erro && servicosEmAndamento.length === 0 && (
            <p className="home-sem-servicos">
              Nenhum serviço em andamento no momento.
            </p>
          )}

          <div className="home-servicos-lista">
            {servicosEmAndamento.map((servico) => (
              <div key={servico.id} className="home-servico-card">
                <div className="home-servico-linha">
                  <span className="home-servico-label">Cliente:</span>
                  <span className="home-servico-valor">
                    {servico.cliente ? servico.cliente.nome : "—"}
                  </span>
                </div>

                <div className="home-servico-linha">
                  <span className="home-servico-label">Descrição:</span>
                  <span className="home-servico-valor">
                    {servico.descricao}
                  </span>
                </div>

                <div className="home-servico-linha">
                  <span className="home-servico-label">Valor total:</span>
                  <span className="home-servico-valor">
                    R$ {Number(servico.valor_total || 0).toFixed(2)}
                  </span>
                </div>

                <div className="home-servico-linha">
                  <span className="home-servico-label">Início:</span>
                  <span className="home-servico-valor">
                    {servico.data_ini
                      ? new Date(servico.data_ini).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
