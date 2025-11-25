import React, { useEffect, useState } from "react";
import "./Servicos.css";
import Modal from "../../components/Modal";
import { FaTools, FaPlus, FaHistory, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import carroFundo from "../../assets/peugeotlogo.png"; // ou sua imagem

export default function Servicos() {
  const navigate = useNavigate();

  // Lista de serviços + clientes integrados
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Campos do formulário
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [cpfCliente, setCpfCliente] = useState("");
  const [data, setData] = useState("");

  // Controle modal
  const [modalNovoServico, setModalNovoServico] = useState(false);
  const [animar, setAnimar] = useState(false);

  // ============================
  // LOAD LOCALSTORAGE
  // ============================
  useEffect(() => {
    setAnimar(true);

    const s = JSON.parse(localStorage.getItem("servicos") || "[]");
    const c = JSON.parse(localStorage.getItem("clientes") || "[]");

    setServicos(s);
    setClientes(c);
  }, []);

  const salvarServicos = (lista) => {
    setServicos(lista);
    localStorage.setItem("servicos", JSON.stringify(lista));
  };

  const salvarClientes = (lista) => {
    setClientes(lista);
    localStorage.setItem("clientes", JSON.stringify(lista));
  };

  // ============================
  // CADASTRAR NOVO SERVIÇO
  // ============================
  const cadastrarServico = (e) => {
    e.preventDefault();

    if (!descricao || !valor || !cpfCliente || !data) {
      alert("Preencha todos os campos.");
      return;
    }

    // Verifica se cliente existe
    const clienteExiste = clientes.find((c) => c.cpf === cpfCliente);
    if (!clienteExiste) {
      alert("Cliente não cadastrado!");
      return;
    }

    const novoServico = {
      id: Date.now(),
      descricao,
      valor,
      cpfCliente,
      data,
      status: "andamento", // todo novo serviço começa em andamento
    };

    salvarServicos([...servicos, novoServico]);

    // Marca cliente como "andamento"
    const clientesAtualizados = clientes.map((c) =>
      c.cpf === cpfCliente ? { ...c, status: "andamento" } : c
    );
    salvarClientes(clientesAtualizados);

    // Limpar campos
    setDescricao("");
    setValor("");
    setCpfCliente("");
    setData("");
    setModalNovoServico(false);
  };

  return (
    <div className="servicos-container">
      <header className="servicos-header">
        <h1>🧰 Serviços da Oficina Sabino</h1>
        <p>Gerencie clientes, manutenções e históricos da oficina.</p>
      </header>

      <div className={`servicos-content ${animar ? "animar" : ""}`}>
        {/* IMAGEM */}
        <div className="servicos-imagem">
          <img src={carroFundo} alt="Carro Peugeot" />
        </div>

        {/* CARDS */}
        <div className="servicos-cards">
          {/* Novo Serviço */}
          <div className="servicos-card card-add" onClick={() => setModalNovoServico(true)}>
            <FaPlus className="icone-card-servico" />
            <h2>Adicionar Serviço</h2>
            <p>Registrar um novo atendimento</p>
          </div>

          {/* Andamento */}
          <div className="servicos-card" onClick={() => navigate("/servicos/andamento")}>
            <FaTools className="icone-card-servico" />
            <h2>Em Andamento</h2>
            <p>Serviços ativos</p>
          </div>

          {/* Garantia */}
          <div className="servicos-card" onClick={() => navigate("/servicos/garantia")}>
            <FaShieldAlt className="icone-card-servico" />
            <h2>Garantia</h2>
            <p>Retornos de clientes</p>
          </div>

          {/* Histórico */}
          <div className="servicos-card" onClick={() => navigate("/servicos/historico")}>
            <FaHistory className="icone-card-servico" />
            <h2>Histórico</h2>
            <p>Conclusões e registros</p>
          </div>
        </div>
      </div>

      {/* ===============================
          MODAL NOVO SERVIÇO
      ================================= */}
      <Modal
        isOpen={modalNovoServico}
        onClose={() => setModalNovoServico(false)}
        title="Cadastrar Novo Serviço"
      >
        <form className="servicos-form" onSubmit={cadastrarServico}>
          <label>Descrição do serviço:</label>
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

          <label>Valor (R$):</label>
          <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} />

          <label>CPF do Cliente:</label>
          <input type="text" value={cpfCliente} onChange={(e) => setCpfCliente(e.target.value)} />

          <label>Data:</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />

          <button type="submit" className="btn-principal">Salvar Serviço</button>
        </form>
      </Modal>
    </div>
  );
}
