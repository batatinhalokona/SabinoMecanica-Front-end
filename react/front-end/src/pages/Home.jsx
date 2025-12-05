import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaTools,
  FaUsers,
  FaClipboardList,
  FaBoxes,
  FaCarSide,
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const [servicosAndamento, setServicosAndamento] = useState([]);

  // =============================
  // FUNÇÃO PARA FORMATAR VEÍCULO
  // =============================
  function formatarVeiculo(s) {
    if (s.carro)
      return `${s.carro.modelo || "Modelo não informado"} - ${
        s.carro.placa || "Placa não informada"
      }`;

    if (s.veiculo)
      return `${s.veiculo.modelo || "Modelo não informado"} - ${
        s.veiculo.placa || "Placa não informada"
      }`;

    if (s.modelo) return s.modelo;

    return "Veículo não informado";
  }

  // =============================
  // CARREGAR SERVIÇOS DO BACKEND
  // =============================
  useEffect(() => {
    const carregarServicos = async () => {
      try {
        const resposta = await axios.get("http://localhost:8080/servicos");

        const lista = resposta.data || [];

        const filtrados = lista.filter(
          (s) =>
            s.status === "andamento" ||
            s.status === "EM_ANDAMENTO" ||
            s.status === "Em Andamento" ||
            s.status === "EM ANDAMENTO" ||
            s.status === "Em andamento"
        );

        setServicosAndamento(filtrados);
      } catch (e) {
        console.error("Erro ao buscar serviços do backend:", e);
        setServicosAndamento([]);
      }
    };

    carregarServicos();
  }, []);

  return (
    <div className="home-container">
      <div className="home-content page-transition-side">
        {/* ===============================
            CABEÇALHO
        =============================== */}
        <header className="home-header">
          <h1>Oficina Sabino</h1>
          <p>Painel principal de controle da oficina.</p>
        </header>

        {/* ===============================
            GRID DOS CARDS PRINCIPAIS
        =============================== */}
        <div className="home-grid">
          <div className="home-card" onClick={() => navigate("/servicos")}>
            <FaTools className="icone-card-home" />
            <h2>Serviços</h2>
            <p>Acompanhe os serviços em andamento, garantia e histórico.</p>
          </div>

          <div className="home-card" onClick={() => navigate("/clientes")}>
            <FaUsers className="icone-card-home" />
            <h2>Clientes</h2>
            <p>Gerencie o cadastro e situação dos clientes.</p>
          </div>

          <div className="home-card" onClick={() => navigate("/carros")}>
            <FaCarSide className="icone-card-home" />
            <h2>Carros</h2>
            <p>Cadastre e consulte os veículos dos clientes.</p>
          </div>

          <div className="home-card" onClick={() => navigate("/registro")}>
            <FaClipboardList className="icone-card-home" />
            <h2>Registro Técnico</h2>
            <p>Salve fotos, medidas e observações de motores.</p>
          </div>

          <div className="home-card" onClick={() => navigate("/estoque")}>
            <FaBoxes className="icone-card-home" />
            <h2>Estoque</h2>
            <p>Controle peças, produtos e quantidades.</p>
          </div>
        </div>

        {/* ===============================
            SERVIÇOS EM ANDAMENTO
        =============================== */}
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
                <div
                  key={s.id || s.codigo || Math.random()}
                  className="home-servico-card"
                >
                  <div className="home-servico-header">
                    <strong>
                      {s.cliente?.nome ||
                        s.clienteNome ||
                        s.nomeCliente ||
                        s.cliente ||
                        "Cliente não informado"}
                    </strong>

                    <span className="home-servico-status">
                      {s.status || "andamento"}
                    </span>
                  </div>

                  {/* =====================
                      VEÍCULO (AGORA OK)
                  ====================== */}
                  <div className="home-servico-linha">
                    <span>🚗 {formatarVeiculo(s)}</span>
                  </div>

                  {/* =====================
                      DESCRIÇÃO DO SERVIÇO
                  ====================== */}
                  <div className="home-servico-linha">
                    <span>
                      🛠️{" "}
                      {s.descricao ||
                        s.servico ||
                        s.tipoServico ||
                        s.nomeServico ||
                        "Serviço não descrito"}
                    </span>
                  </div>

                  {/* =====================
                      DATA
                  ====================== */}
                  {(s.data || s.dataEntrada) && (
                    <div className="home-servico-linha">
                      <span>📅 {s.data || s.dataEntrada}</span>
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
