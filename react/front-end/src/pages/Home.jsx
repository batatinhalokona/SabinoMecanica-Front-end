import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Ícones
import { FaTools, FaUsers, FaWarehouse, FaCamera } from "react-icons/fa";

// Estilo
import "./Home.css";

// API backend configurada
import api from "../api/api";

export default function Home() {
  const navigate = useNavigate();

  // Estado de serviços
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Usuário logado
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  // Buscar serviços
  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    async function buscarServicos() {
      try {
        setCarregando(true);
        setErro("");

        const resp = await api.get("/servico");
        const lista = resp.data || [];

        const emAndamento = lista.filter((s) => {
          const status = (s.status || s.situacao || "").toString().toUpperCase();
          return (
            status.includes("ANDAMENTO") ||
            status.includes("EM_ANDAMENTO") ||
            status.includes("PENDENTE") ||
            status.includes("ABERTO")
          );
        });

        setServicos(emAndamento.length > 0 ? emAndamento : lista);
      } catch (e) {
        setErro("Erro ao carregar serviços.");
      } finally {
        setCarregando(false);
      }
    }

    buscarServicos();
  }, [usuario, navigate]);

  if (!usuario) return null;

  return (
    <div className="home-root-claro">
      {/* =================== HEADER =================== */}
      <header className="home-header-claro">
        <div className="home-header-textos">
          <h1 className="home-header-titulo">Painel da Oficina Sabino</h1>
          <p className="home-header-subtitulo">
            Acompanhe serviços e acesse rapidamente os setores.
          </p>
          <p className="home-header-usuario">
            Olá, <strong>{usuario.nome || "Gerente"}</strong>
          </p>
        </div>

        <button className="home-sair-btn" onClick={handleLogout}>
          Sair
        </button>
      </header>

      {/* =================== CONTEÚDO =================== */}
      <main className="home-main-claro">
        {/* ======== SERVIÇOS EM ANDAMENTO ======== */}
        <section className="home-servicos-section">
          <h2 className="home-section-title">Serviços em andamento</h2>
          <p className="home-section-subtitle">
            Veja rapidamente os serviços que estão em execução.
          </p>

          {carregando && <p className="home-info-text">Carregando...</p>}
          {erro && <p className="home-error-text">{erro}</p>}

          {!carregando && !erro && servicos.length === 0 && (
            <p className="home-info-text">Nenhum serviço em andamento.</p>
          )}

          {!carregando && !erro && servicos.length > 0 && (
            <div className="home-servicos-lista">
              {servicos.slice(0, 5).map((s) => (
                <div key={s.id || s.codigo} className="home-servico-card">
                  <div className="home-servico-linha">
                    <span className="home-servico-label">Cliente:</span>
                    <span className="home-servico-valor">
                      {s.cliente?.nome || s.nomeCliente || "—"}
                    </span>
                  </div>

                  <div className="home-servico-linha">
                    <span className="home-servico-label">Serviço:</span>
                    <span className="home-servico-valor">
                      {s.descricao || s.servico || "—"}
                    </span>
                  </div>

                  <div className="home-servico-linha">
                    <span className="home-servico-label">Veículo:</span>
                    <span className="home-servico-valor">
                      {s.modelo || s.carro || s.veiculo || "—"}
                    </span>
                  </div>

                  <div className="home-servico-footer">
                    <span className="home-servico-status">
                      {(s.status || s.situacao || "Em andamento").toString()}
                    </span>

                    <span className="home-servico-data">
                      {s.data || s.dataEntrada || ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className="home-ver-todos-btn"
            onClick={() => navigate("/servicos")}
          >
            Ver todos os serviços
          </button>
        </section>

        {/* ======== CARDS ACESSOS RÁPIDOS ======== */}
        <section className="home-cards-area-claro">
          <h2 className="home-cards-title-claro">Acessos rápidos</h2>

          <div className="home-cards-grid-claro">
            <div className="home-card-claro" onClick={() => navigate("/servicos")}>
              <div className="home-card-icon-wrapper-claro">
                <FaTools className="home-card-icon-claro" />
              </div>
              <h3 className="home-card-title-claro">Serviços</h3>
              <p className="home-card-text-claro">Gerencie os serviços.</p>
            </div>

            <div className="home-card-claro" onClick={() => navigate("/clientes")}>
              <div className="home-card-icon-wrapper-claro">
                <FaUsers className="home-card-icon-claro" />
              </div>
              <h3 className="home-card-title-claro">Clientes</h3>
              <p className="home-card-text-claro">Cadastre e consulte clientes.</p>
            </div>

            <div className="home-card-claro" onClick={() => navigate("/registro")}>
              <div className="home-card-icon-wrapper-claro">
                <FaCamera className="home-card-icon-claro" />
              </div>
              <h3 className="home-card-title-claro">Registro</h3>
              <p className="home-card-text-claro">Fotos e anotações.</p>
            </div>

            <div className="home-card-claro" onClick={() => navigate("/estoque")}>
              <div className="home-card-icon-wrapper-claro">
                <FaWarehouse className="home-card-icon-claro" />
              </div>
              <h3 className="home-card-title-claro">Estoque</h3>
              <p className="home-card-text-claro">Peças e produtos.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
