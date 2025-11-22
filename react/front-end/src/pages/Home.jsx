// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
// Ícones para os cards e botão sair
import { FaTools, FaUsers, FaWarehouse, FaSignOutAlt } from "react-icons/fa";
// Hook para navegação entre rotas
import { useNavigate } from "react-router-dom";
// Nossa instância do Axios configurada
import api from "../api/api";
// Estilos específicos da Home
import "./Home.css";

export default function Home() {
  // Lista completa de serviços vindos do backend
  const [servicos, setServicos] = useState([]);
  // Texto de erro (se der problema na API)
  const [erro, setErro] = useState(null);
  // Hook de navegação
  const navigate = useNavigate();

  // Busca os serviços no backend quando a Home carrega
  useEffect(() => {
    const buscarServicos = async () => {
      try {
        // Chamada para o endpoint do Spring Boot
        const response = await api.get("/api/servicos");
        // Salva todos os serviços recebidos
        setServicos(response.data);
        // Limpa erro, caso tivesse
        setErro(null);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        setErro("Não foi possível carregar os serviços.");
      }
    };

    buscarServicos();
  }, []);

  // Filtra apenas serviços em andamento (data_fim == null)
  const servicosEmAndamento = servicos.filter(
    (servico) => servico.data_fim === null
  );

  // Função de logout da Home (limpa localStorage e volta pro login)
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    // Container geral da página Home
    <div className="home-container">
      {/* Cabeçalho com título e botão de sair */}
      <header className="home-header">
        <div className="home-header-left">
          <h1>Oficina Sabino</h1>
          <span>Painel principal</span>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Sair</span>
        </button>
      </header>

      {/* Área principal: cards à esquerda e serviços à direita */}
      <main className="home-main">
        {/* Coluna de cards de navegação */}
        <section className="cards-section">
          {/* Card Serviços */}
          <div
            className="home-card"
            onClick={() => navigate("/servicos")}
          >
            <FaTools className="card-icon" />
            <div>
              <h2>Serviços</h2>
              <p>Gerencie serviços em andamento e concluídos.</p>
            </div>
          </div>

          {/* Card Clientes */}
          <div
            className="home-card"
            onClick={() => navigate("/clientes")}
          >
            <FaUsers className="card-icon" />
            <div>
              <h2>Clientes</h2>
              <p>Cadastre e consulte os dados dos seus clientes.</p>
            </div>
          </div>

          {/* Card Estoque */}
          <div
            className="home-card"
            onClick={() => navigate("/estoque")}
          >
            <FaWarehouse className="card-icon" />
            <div>
              <h2>Estoque</h2>
              <p>Controle peças novas, usadas e óleos da oficina.</p>
            </div>
          </div>
        </section>

        {/* Coluna de serviços em andamento */}
        <section className="servicos-section">
          <h2>Serviços em andamento</h2>

          {/* Mensagem de erro (caso a API falhe) */}
          {erro && <p className="erro-texto">{erro}</p>}

          {/* Mensagem caso não tenha serviços em andamento */}
          {!erro && servicosEmAndamento.length === 0 && (
            <p className="sem-servicos">
              Nenhum serviço em andamento no momento.
            </p>
          )}

          {/* Lista dos serviços em andamento */}
          <div className="servicos-lista">
            {servicosEmAndamento.map((servico) => (
              <div key={servico.id} className="servico-card">
                <div className="servico-linha">
                  <span className="servico-label">Cliente:</span>
                  <span className="servico-valor">
                    {servico.cliente ? servico.cliente.nome : "—"}
                  </span>
                </div>

                <div className="servico-linha">
                  <span className="servico-label">Descrição:</span>
                  <span className="servico-valor">{servico.descricao}</span>
                </div>

                <div className="servico-linha">
                  <span className="servico-label">Valor total:</span>
                  <span className="servico-valor">
                    R$ {Number(servico.valor_total || 0).toFixed(2)}
                  </span>
                </div>

                <div className="servico-linha">
                  <span className="servico-label">Início:</span>
                  <span className="servico-valor">
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
