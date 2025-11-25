import React, { useEffect, useState } from "react";
import "./Clientes.css";
import Modal from "../../components/Modal";
import { FaUserPlus, FaTools, FaMoneyBillAlt, FaEdit } from "react-icons/fa";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  // Form cadastro/edição
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [carro, setCarro] = useState("");
  const [placa, setPlaca] = useState("");

  // Auxiliares
  const [busca, setBusca] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);

  // Modais
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalAndamento, setModalAndamento] = useState(false);
  const [modalPendente, setModalPendente] = useState(false);

  // ============================
  // LocalStorage
  // ============================
  useEffect(() => {
    try {
      const armazenados = JSON.parse(localStorage.getItem("clientes") || "[]");
      setClientes(armazenados);
    } catch {
      setClientes([]);
    }
  }, []);

  const salvarClientes = (lista) => {
    setClientes(lista);
    localStorage.setItem("clientes", JSON.stringify(lista));
  };

  // ============================
  // Cadastro
  // ============================
  const cadastrarCliente = (e) => {
    e.preventDefault();
    if (!nome || !telefone || !carro || !placa) {
      alert("Nome, Telefone, Carro e Placa são obrigatórios.");
      return;
    }

    const novoCliente = {
      id: Date.now(),
      nome,
      telefone,
      carro,
      placa,
      cpf: cpf ? cpf : "Sem CPF",
      status: null,
    };

    salvarClientes([...clientes, novoCliente]);

    setNome("");
    setTelefone("");
    setCpf("");
    setCarro("");
    setPlaca("");
    setModalRegistrar(false);
  };

  // ============================
  // Editar Cliente
  // ============================
  const abrirEdicao = (cliente) => {
    setClienteEditando(cliente);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setCpf(cliente.cpf === "Sem CPF" ? "" : cliente.cpf);
    setCarro(cliente.carro);
    setPlaca(cliente.placa);
    setModalEditar(true);
  };

  const salvarEdicao = (e) => {
    e.preventDefault();
    const listaAtualizada = clientes.map((c) =>
      c.id === clienteEditando.id
        ? {
            ...c,
            nome,
            telefone,
            carro,
            placa,
            cpf: cpf ? cpf : "Sem CPF",
          }
        : c
    );

    salvarClientes(listaAtualizada);
    setModalEditar(false);
    setClienteEditando(null);

    setNome("");
    setTelefone("");
    setCpf("");
    setCarro("");
    setPlaca("");
  };

  // ============================
  // Status
  // ============================
  const marcarPendente = (cliente) => {
    salvarClientes(
      clientes.map((c) =>
        c.id === cliente.id ? { ...c, status: "pendente" } : c
      )
    );
  };

  const marcarConcluido = (cliente) => {
    salvarClientes(
      clientes.map((c) =>
        c.id === cliente.id ? { ...c, status: "concluido" } : c
      )
    );
  };

  // ============================
  // Filtros
  // ============================
  const clientesAndamento = clientes.filter((c) => c.status === "andamento");
  const clientesPendente = clientes.filter((c) => c.status === "pendente");
  const clientesHistorico = clientes.filter((c) => c.status === "concluido");

  const aplicarBusca = (lista) => {
    if (!busca) return lista;
    const termo = busca.toLowerCase();
    return lista.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.telefone.toLowerCase().includes(termo) ||
        c.carro.toLowerCase().includes(termo) ||
        c.placa.toLowerCase().includes(termo)
    );
  };

  // ============================
  // JSX
  // ============================
  return (
    <div className="clientes-container">
      <div className="clientes-content page-transition-side">
        <h1 className="titulo-clientes">Gestão de Clientes</h1>

        <div className="clientes-grid">
          <button className="clientes-card" onClick={() => setModalRegistrar(true)}>
            <FaUserPlus className="icone-card" />
            <p>Registrar Cliente</p>
          </button>

          <button className="clientes-card" onClick={() => setModalAndamento(true)}>
            <FaTools className="icone-card" />
            <p>Em Andamento</p>
          </button>

          <button className="clientes-card" onClick={() => setModalPendente(true)}>
            <FaMoneyBillAlt className="icone-card" />
            <p>Pendentes</p>
          </button>
        </div>
      </div>

      {/* ==========================
          HISTÓRICO
      ========================== */}
      <div className="clientes-historico-area">
        <h2 className="subtitulo-historico">📜 Histórico de Clientes</h2>

        <div className="area-busca-clientes">
          <input
            type="text"
            placeholder="Buscar por nome, telefone, carro ou placa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {aplicarBusca(clientesHistorico).length === 0 ? (
          <p className="texto-vazio">Nenhum cliente finalizado.</p>
        ) : (
          aplicarBusca(clientesHistorico).map((c) => (
            <div key={c.id} className="card-cliente-historico">
              <div>
                <strong>{c.nome}</strong>
                <p>📞 {c.telefone}</p>
                <p>🚗 {c.carro} • {c.placa}</p>
                <p>🧾 CPF: {c.cpf}</p>
              </div>

              <button className="btn-mini-edit" onClick={() => abrirEdicao(c)}>
                <FaEdit />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ==========================
          MODAL - CADASTRO
      ========================== */}
      <Modal
        isOpen={modalRegistrar}
        onClose={() => setModalRegistrar(false)}
        title="Cadastrar Novo Cliente"
      >
        <form className="modal-form" onSubmit={cadastrarCliente}>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

          <label>Telefone:</label>
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

          <label>CPF (opcional):</label>
          <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />

          <label>Carro / Modelo:</label>
          <input type="text" value={carro} onChange={(e) => setCarro(e.target.value)} />

          <label>Placa:</label>
          <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} />

          <button type="submit" className="btn-principal">
            Cadastrar
          </button>
        </form>
      </Modal>

      {/* ==========================
          MODAL - EDITAR
      ========================== */}
      <Modal
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        title="Editar Cliente"
      >
        <form className="modal-form" onSubmit={salvarEdicao}>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

          <label>Telefone:</label>
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

          <label>CPF (opcional):</label>
          <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />

          <label>Carro / Modelo:</label>
          <input type="text" value={carro} onChange={(e) => setCarro(e.target.value)} />

          <label>Placa:</label>
          <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} />

          <button type="submit" className="btn-principal">
            Salvar Alterações
          </button>
        </form>
      </Modal>

      {/* ==========================
          MODAL - ANDAMENTO
      ========================== */}
      <Modal
        isOpen={modalAndamento}
        onClose={() => setModalAndamento(false)}
        title="Clientes em Serviço (Em Andamento)"
      >
        {clientesAndamento.length === 0 ? (
          <p className="texto-vazio">Nenhum serviço em andamento.</p>
        ) : (
          clientesAndamento.map((c) => (
            <div key={c.id} className="card-lista">
              <strong>{c.nome}</strong>
              <span>{c.carro} • {c.placa}</span>
              <button className="btn-mini" onClick={() => marcarPendente(c)}>
                Finalizar (Pendente)
              </button>
            </div>
          ))
        )}
      </Modal>

      {/* ==========================
          MODAL - PENDENTES
      ========================== */}
      <Modal
        isOpen={modalPendente}
        onClose={() => setModalPendente(false)}
        title="Clientes Pendentes de Pagamento"
      >
        {clientesPendente.length === 0 ? (
          <p className="texto-vazio">Nenhum pendente.</p>
        ) : (
          clientesPendente.map((c) => (
            <div key={c.id} className="card-lista">
              <strong>{c.nome}</strong>
              <span>{c.carro} • {c.placa}</span>
              <button className="btn-mini" onClick={() => marcarConcluido(c)}>
                Receber (Concluir)
              </button>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
}
