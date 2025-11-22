import React, { useEffect, useState } from "react";
import { FaTools, FaUsers, FaWarehouse, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Home.css";

export default function Home() {
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarServicos = async () => {
      try {
        const response = await api.get("/api/servicos"); // <-- AQUI IGUAL AO BACK
        setServicos(response.data);
        setErro(null);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        setErro("Não foi possível carregar os serviços.");
      }
    };

    buscarServicos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/"); // volta pra tela de login
  };

  // Se você quiser considerar "em andamento" = data_fim == null:
  const servicosEmAndamento = servicos.filter(
    (servico) => servico.data_fim === null
  );

  return (
    <div className="home-container">
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

      <main className="home-main">
        {/* cards de navegação */}
        <section className="cards-section">
          <div className="home-card" onClick={() => navigate("/servicos")}>
            <FaTools className="card-icon" />
            <h2>Serviços</h2>
            <p>Gerencie serviços em andamento e concluídos.</p>
          </div>

          <div className="home-card" onClick={() => navigate("/clientes")}>
            <FaUsers className="card-icon" />
            <h2>Clientes</h2>
            <p>Cadastre e consulte clientes.</p>
          </div>

          <div className="home-card" onClick={() => navigate("/estoque")}>
            <FaWarehouse className="card-icon" />
            <h2>Estoque</h2>
            <p>Controle peças e materiais da oficina.</p>
          </div>
        </section>

        {/* serviços em andamento */}
        <section className="servicos-section">
          <h2>Serviços em andamento</h2>

          {erro && <p className="erro-texto">{erro}</p>}

          {!erro && servicosEmAndamento.length === 0 && (
            <p className="sem-servicos">
              Nenhum serviço em andamento no momento.
            </p>
          )}

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
