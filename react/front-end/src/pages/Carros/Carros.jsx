import React, { useEffect, useState } from "react";
import "./Carros.css";
import Modal from "../../components/Modal";
import { FaCarSide, FaPlus, FaSearch, FaTrash } from "react-icons/fa";

export default function Carros() {
  const [carros, setCarros] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  // Campos do formulário
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState("");
  const [cor, setCor] = useState("");
  const [cliente, setCliente] = useState("");

  // Carregar do localStorage
  useEffect(() => {
    const armazenados = JSON.parse(localStorage.getItem("carros") || "[]");
    setCarros(armazenados);
  }, []);

  const salvarCarros = (lista) => {
    setCarros(lista);
    localStorage.setItem("carros", JSON.stringify(lista));
  };

  const cadastrarCarro = (e) => {
    e.preventDefault();

    if (!modelo || !placa) {
      alert("Modelo e placa são obrigatórios.");
      return;
    }

    const novoCarro = {
      id: Date.now(),
      modelo,
      placa,
      ano,
      cor,
      cliente, // dono do carro (opcional)
    };

    salvarCarros([...carros, novoCarro]);

    setModelo("");
    setPlaca("");
    setAno("");
    setCor("");
    setCliente("");
    setModalAberto(false);
  };

  const excluirCarro = (id) => {
    if (!window.confirm("Deseja excluir este carro?")) return;
    salvarCarros(carros.filter((c) => c.id !== id));
  };

  const aplicarBusca = () => {
    if (!busca) return carros;
    const termo = busca.toLowerCase();
    return carros.filter(
      (c) =>
        c.modelo.toLowerCase().includes(termo) ||
        c.placa.toLowerCase().includes(termo) ||
        (c.cliente && c.cliente.toLowerCase().includes(termo))
    );
  };

  const carrosFiltrados = aplicarBusca();

  return (
    <div className="carros-container">
      <div className="carros-content page-transition-side">
        <h1 className="titulo-carros">Cadastro de Carros</h1>

        {/* CARD PRINCIPAL */}
        <div className="carros-grid">
          <button className="carros-card" onClick={() => setModalAberto(true)}>
            <FaCarSide className="icone-card-carro" />
            <p>Cadastrar Carro</p>
          </button>
        </div>

        {/* BUSCA */}
        <div className="carros-busca">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar por modelo, placa ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* LISTA DE CARROS */}
        <h2 className="carros-subtitulo">Carros Cadastrados</h2>

        {carrosFiltrados.length === 0 ? (
          <p className="texto-vazio">Nenhum carro cadastrado.</p>
        ) : (
          carrosFiltrados.map((c) => (
            <div key={c.id} className="carros-item">
              <div>
                <strong>{c.modelo}</strong>
                <p>🚘 Placa: {c.placa}</p>
                {c.ano && <p>📅 Ano: {c.ano}</p>}
                {c.cor && <p>🎨 Cor: {c.cor}</p>}
                {c.cliente && <p>👤 Cliente: {c.cliente}</p>}
              </div>
              <button className="btn-delete" onClick={() => excluirCarro(c.id)}>
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      {/* MODAL CADASTRO */}
      <Modal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Cadastrar Carro"
      >
        <form className="carros-form" onSubmit={cadastrarCarro}>
          <label>Modelo:</label>
          <input
            type="text"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />

          <label>Placa:</label>
          <input
            type="text"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
          />

          <label>Ano (opcional):</label>
          <input
            type="number"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          />

          <label>Cor (opcional):</label>
          <input
            type="text"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
          />

          <label>Cliente (opcional):</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />

          <button type="submit" className="btn-principal">
            Salvar Carro
          </button>
        </form>
      </Modal>
    </div>
  );
}
