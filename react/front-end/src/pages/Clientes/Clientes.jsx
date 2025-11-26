import React, { useEffect, useState } from "react";
import "./Clientes.css";
import Modal from "../../components/Modal";
import {
  FaUserPlus,
  FaTools,
  FaMoneyBillAlt,
} from "react-icons/fa";
import api from "../../api/api"; // <- nosso axios com baseURL

export default function Clientes() {
  // Lista de clientes vinda da API
  const [clientes, setClientes] = useState([]);

  // Campos do formulário de cadastro
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [carro, setCarro] = useState("");
  const [placa, setPlaca] = useState("");

  // Campo de busca (histórico)
  const [busca, setBusca] = useState("");

  // Controle de modais
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalAndamento, setModalAndamento] = useState(false);
  const [modalPendente, setModalPendente] = useState(false);

  // Carregando / erro (opcional)
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // ============================
  //   Carregar clientes da API
  // ============================
  const carregarClientes = async () => {
    try {
      setCarregando(true);
      setErro("");
      // 🔁 AJUSTE AQUI SE PRECISAR: "/clientes" -> rota do seu backend
      const response = await api.get("/clientes");
      setClientes(response.data || []);
    } catch (e) {
      console.error("Erro ao carregar clientes:", e);
      setErro("Erro ao carregar clientes do servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  // ============================
  //   Cadastro de Cliente (POST)
  // ============================
  const cadastrarCliente = async (e) => {
    e.preventDefault();

    if (!nome || !telefone) {
      alert("Nome e telefone são obrigatórios.");
      return;
    }

    // Monta objeto conforme esperado pelo backend
    const novoCliente = {
      nome,
      telefone,
      cpf: cpf || null,
      carro: carro || null,
      placa: placa || null,
      status: "CONCLUIDO", // ou "EM_ANDAMENTO"/"ATIVO", depende de como estiver no back
    };

    try {
      setErro("");
      // 🔁 AJUSTE AQUI SE PRECISAR: "/clientes"
      const response = await api.post("/clientes", novoCliente);

      // Se o back já devolve o cliente salvo com id:
      const clienteSalvo = response.data || novoCliente;

      setClientes((lista) => [clienteSalvo, ...lista]);

      // Limpar form
      setNome("");
      setTelefone("");
      setCpf("");
      setCarro("");
      setPlaca("");
      setModalRegistrar(false);
    } catch (e) {
      console.error("Erro ao cadastrar cliente:", e);
      alert("Erro ao cadastrar cliente no servidor.");
    }
  };

  // ============================
  //   Atualizar status (PUT)
  // ============================
  const atualizarStatus = async (cliente, novoStatus) => {
    try {
      setErro("");

      const clienteAtualizado = {
        ...cliente,
        status: novoStatus,
      };

      // 🔁 AJUSTE AQUI SE PRECISAR: `/clientes/${cliente.id}`
      const response = await api.put(
        `/clientes/${cliente.id}`,
        clienteAtualizado
      );

      const retorno = response.data || clienteAtualizado;

      setClientes((lista) =>
        lista.map((c) => (c.id === retorno.id ? retorno : c))
      );
    } catch (e) {
      console.error("Erro ao atualizar status do cliente:", e);
      alert("Erro ao atualizar status no servidor.");
    }
  };

  const marcarAndamento = (cliente) =>
    atualizarStatus(cliente, "EM_ANDAMENTO");

  const marcarPendente = (cliente) =>
    atualizarStatus(cliente, "PENDENTE");

  const marcarConcluido = (cliente) =>
    atualizarStatus(cliente, "CONCLUIDO");

  // ============================
  //   Filtros por status
  // ============================
  const clientesAndamento = clientes.filter(
    (c) =>
      c.status === "EM_ANDAMENTO" ||
      c.status === "andamento" ||
      c.status === "Em Andamento"
  );

  const clientesPendente = clientes.filter(
    (c) =>
      c.status === "PENDENTE" ||
      c.status === "pendente"
  );

  const clientesHistorico = clientes.filter(
    (c) =>
      !c.status ||
      c.status === "CONCLUIDO" ||
      c.status === "concluido" ||
      c.status === "Concluído"
  );

  // ============================
  //   Busca (histórico)
  // ============================
  const aplicarBusca = (lista) => {
    if (!busca) return lista;

    const termo = busca.toLowerCase();
    const termoNum = busca.replace(/\D/g, "");

    return lista.filter((c) => {
      const cpfNumero = (c.cpf || "").replace(/\D/g, "");
      return (
        (c.nome || "").toLowerCase().includes(termo) ||
        cpfNumero.includes(termoNum) ||
        (c.carro || "").toLowerCase().includes(termo) ||
        (c.placa || "").toLowerCase().includes(termo)
      );
    });
  };

  const historicoFiltrado = aplicarBusca(clientesHistorico);

  // ============================
  //   JSX
  // ============================
  return (
    <div className="clientes-container">
      <div className="clientes-content page-transition-side">
        <h1 className="titulo-clientes">Gestão de Clientes</h1>
        <p className="subtitulo-clientes">
          Cadastre clientes, acompanhe os serviços em andamento e pendências.
        </p>

        {erro && <p className="msg-erro-clientes">{erro}</p>}
        {carregando && <p className="msg-carregando-clientes">Carregando...</p>}

        {/* CARDS PRINCIPAIS */}
        <div className="clientes-grid">
          {/* Registrar Cliente */}
          <button
            className="clientes-card"
            onClick={() => setModalRegistrar(true)}
          >
            <FaUserPlus className="icone-card" />
            <p>Registrar Cliente</p>
          </button>

          {/* Em Andamento */}
          <button
            className="clientes-card"
            onClick={() => setModalAndamento(true)}
          >
            <FaTools className="icone-card" />
            <p>Clientes em Andamento</p>
          </button>

          {/* Pendentes */}
          <button
            className="clientes-card"
            onClick={() => setModalPendente(true)}
          >
            <FaMoneyBillAlt className="icone-card" />
            <p>Clientes Pendentes</p>
          </button>
        </div>

        {/* ============================
            HISTÓRICO NA PARTE DE BAIXO
        ============================ */}
        <section className="clientes-historico-section">
          <div className="clientes-historico-header">
            <h2>📜 Histórico de Clientes</h2>
            <input
              type="text"
              placeholder="Buscar por nome, CPF, carro ou placa..."
              className="clientes-busca"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {historicoFiltrado.length === 0 ? (
            <p className="texto-vazio">Nenhum cliente no histórico.</p>
          ) : (
            <div className="clientes-historico-lista">
              {historicoFiltrado.map((c) => (
                <div key={c.id} className="card-lista">
                  <div>
                    <p>
                      <strong>{c.nome}</strong>
                    </p>
                    <span>{c.telefone}</span>
                    {c.cpf && <span>CPF: {c.cpf}</span>}
                    {(c.carro || c.placa) && (
                      <span>
                        {c.carro || ""} {c.placa ? `- ${c.placa}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ============================
          MODAL - REGISTRAR CLIENTE
      ============================ */}
      <Modal
        isOpen={modalRegistrar}
        onClose={() => setModalRegistrar(false)}
        title="Cadastrar Novo Cliente"
      >
        <form className="modal-form" onSubmit={cadastrarCliente}>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Telefone:</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <label>CPF (opcional):</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <label>Carro (opcional):</label>
          <input
            type="text"
            value={carro}
            onChange={(e) => setCarro(e.target.value)}
          />

          <label>Placa (opcional):</label>
          <input
            type="text"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
          />

          <button type="submit" className="btn-principal">
            Cadastrar
          </button>
        </form>
      </Modal>

      {/* ============================
          MODAL - EM ANDAMENTO
      ============================ */}
      <Modal
        isOpen={modalAndamento}
        onClose={() => setModalAndamento(false)}
        title="Clientes com Serviço em Andamento"
      >
        {clientesAndamento.length === 0 ? (
          <p className="texto-vazio">Nenhum cliente em andamento.</p>
        ) : (
          clientesAndamento.map((c) => (
            <div key={c.id} className="card-lista">
              <div>
                <p>
                  <strong>{c.nome}</strong>
                </p>
                {c.carro && (
                  <span>
                    🚗 {c.carro} {c.placa ? `- ${c.placa}` : ""}
                  </span>
                )}
              </div>
              <div className="linha-botoes-mini">
                <button
                  className="btn-mini"
                  onClick={() => marcarPendente(c)}
                >
                  Marcar Pendente
                </button>
                <button
                  className="btn-mini secundario"
                  onClick={() => marcarConcluido(c)}
                >
                  Concluir
                </button>
              </div>
            </div>
          ))
        )}
      </Modal>

      {/* ============================
          MODAL - PENDENTES
      ============================ */}
      <Modal
        isOpen={modalPendente}
        onClose={() => setModalPendente(false)}
        title="Clientes Pendentes de Pagamento"
      >
        {clientesPendente.length === 0 ? (
          <p className="texto-vazio">Nenhum cliente pendente.</p>
        ) : (
          clientesPendente.map((c) => (
            <div key={c.id} className="card-lista">
              <div>
                <p>
                  <strong>{c.nome}</strong>
                </p>
                {c.carro && (
                  <span>
                    🚗 {c.carro} {c.placa ? `- ${c.placa}` : ""}
                  </span>
                )}
              </div>
              <div className="linha-botoes-mini">
                <button
                  className="btn-mini"
                  onClick={() => marcarAndamento(c)}
                >
                  Voltar p/ Andamento
                </button>
                <button
                  className="btn-mini secundario"
                  onClick={() => marcarConcluido(c)}
                >
                  Receber / Concluir
                </button>
              </div>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
}
