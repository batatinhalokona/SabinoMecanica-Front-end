import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./Carros.css";

export default function Carros() {
  // ===== CAMPOS DO FORMULÁRIO =====
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [cor, setCor] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  // Dono do carro
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [buscaCliente, setBuscaCliente] = useState("");

  // Listas
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);

  // Edição
  const [carroEditandoId, setCarroEditandoId] = useState(null);

  // Busca carro
  const [buscaCarro, setBuscaCarro] = useState("");

  // Modal foto
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  const navigate = useNavigate();

  // PROTEÇÃO para garantir que clientes e carros sempre são arrays
  const listaClientes = Array.isArray(clientes) ? clientes : [];
  const listaCarros = Array.isArray(carros) ? carros : [];

  // ===== CARREGA LISTAS =====
  useEffect(() => {
    carregarCarros();
    carregarClientes();
  }, []);

  async function carregarCarros() {
    try {
      const response = await api.get("/carros");
      setCarros(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log("Erro ao listar carros:", err);
      setCarros([]);
    }
  }

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log("Erro ao listar clientes:", err);
      setClientes([]);
    }
  }

  // ===== SALVAR CARRO =====
  async function salvarCarro(e) {
    e.preventDefault();

    if (!placa.trim() || !modelo.trim()) {
      alert("Placa e modelo são obrigatórios!");
      return;
    }

    if (!clienteSelecionado) {
      alert("Selecione o dono do carro.");
      return;
    }

    const dadosCarro = {
      placa,
      modelo,
      marca,
      cor,
      fotoUrl: fotoUrl || null,
      clienteId: clienteSelecionado.id,
    };

    try {
      if (carroEditandoId) {
        await api.put(`/carros/${carroEditandoId}`, dadosCarro);
        alert("Carro atualizado!");
      } else {
        await api.post("/carros", dadosCarro);
        alert("Carro cadastrado!");
      }

      carregarCarros();
      limparCampos();
    } catch (err) {
      console.log("Erro ao salvar carro:", err);
      alert("Erro ao salvar carro.");
    }
  }

  function limparCampos() {
    setPlaca("");
    setModelo("");
    setMarca("");
    setCor("");
    setFotoUrl("");
    setClienteSelecionado(null);
    setBuscaCliente("");
    setCarroEditandoId(null);
  }

  // ===== PREPARAR EDIÇÃO =====
  function prepararEdicao(carro) {
    setPlaca(carro.placa || "");
    setModelo(carro.modelo || "");
    setMarca(carro.marca || "");
    setCor(carro.cor || "");
    setFotoUrl(carro.fotoUrl || "");
    setClienteSelecionado(carro.cliente || null);
    setCarroEditandoId(carro.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ===== EXCLUIR CARRO =====
  async function excluirCarro(carro) {
    if (!window.confirm("Tem certeza que deseja excluir este carro?")) return;

    try {
      await api.delete(`/carros/${carro.id}`);
      carregarCarros();
    } catch (err) {
      console.log("Erro ao excluir carro:", err);

      if (err.response?.data) {
        alert(err.response.data);
      } else {
        alert("Erro ao excluir carro.");
      }
    }
  }

  // ===== VER HISTÓRICO =====
  function verHistorico(carro) {
    navigate(`/servicos?carroId=${carro.id}`);
  }

  // ===== NOVA OS =====
  function novaOrdemServico(carro) {
    navigate(`/servicos/novo?carroId=${carro.id}`);
  }

  // ===== FILTRO DE CARROS =====
  const carrosFiltrados = listaCarros.filter((c) => {
    if (!buscaCarro.trim()) return true;
    const texto = buscaCarro.toLowerCase();

    return (
      c.placa?.toLowerCase().includes(texto) ||
      c.modelo?.toLowerCase().includes(texto) ||
      c.marca?.toLowerCase().includes(texto) ||
      c.cliente?.nome?.toLowerCase().includes(texto)
    );
  });

  // ===== FILTRO DE CLIENTES =====
  const clientesFiltrados = listaClientes.filter((cli) => {
    if (!buscaCliente.trim()) return true;
    const texto = buscaCliente.toLowerCase();

    return (
      cli.nome?.toLowerCase().includes(texto) ||
      cli.telefone?.toLowerCase().includes(texto) ||
      cli.cpf?.toLowerCase().includes(texto)
    );
  });

  return (
    <div className="carros-container">
      <h1 className="titulo">Carros</h1>

      {/* ===== FORMULÁRIO ===== */}
      <form className="form" onSubmit={salvarCarro}>
        <label className="label">Placa :</label>
        <input
          className="input"
          type="text"
          placeholder="ABC-1D23"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          required
        />

        <label className="label">Modelo :</label>
        <input
          className="input"
          type="text"
          placeholder="Modelo do carro"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          required
        />

        <label className="label">Marca :</label>
        <input
          className="input"
          type="text"
          placeholder="Marca do carro"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />

        <label className="label">Cor :</label>
        <input
          className="input"
          type="text"
          placeholder="Cor do carro"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
        />

        <label className="label">Foto (URL opcional):</label>
        <input
          className="input"
          type="text"
          placeholder="Cole aqui o link da foto"
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
        />

        {fotoUrl && (
          <div className="preview-foto">
            <p>Pré-visualização:</p>
            <img
              src={fotoUrl}
              alt="Foto"
              className="foto-preview"
              onClick={() => setFotoAmpliada(fotoUrl)}
            />
          </div>
        )}

        {/* DONO DO CARRO */}
        <div className="dono-container">
          <label className="label">Dono do carro :</label>

          {clienteSelecionado ? (
            <div className="dono-selecionado">
              <span>
                Selecionado: <strong>{clienteSelecionado.nome}</strong> (
                {clienteSelecionado.telefone})
              </span>
              <button
                type="button"
                className="btn-trocar-dono"
                onClick={() => setClienteSelecionado(null)}
              >
                Trocar dono
              </button>
            </div>
          ) : (
            <>
              <input
                className="input"
                type="text"
                placeholder="Buscar cliente..."
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
              />

              <div className="lista-clientes">
                {clientesFiltrados.slice(0, 5).map((cli) => (
                  <div
                    key={cli.id}
                    className="item-cliente"
                    onClick={() => setClienteSelecionado(cli)}
                  >
                    <span className="nome-cliente">{cli.nome}</span>
                    <span className="detalhes-cliente">
                      {cli.telefone} {cli.cpf && `- ${cli.cpf}`}
                    </span>
                  </div>
                ))}

                {clientesFiltrados.length === 0 && (
                  <p className="nenhum-cliente">Nenhum cliente encontrado.</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="botoes-form">
          <button className="btn-cadastrar" type="submit">
            {carroEditandoId ? "Salvar Alterações" : "Cadastrar Carro"}
          </button>

          {carroEditandoId && (
            <button type="button" className="btn-cancelar" onClick={limparCampos}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      {/* ===== BUSCA ===== */}
      <div className="busca-container">
        <label className="label">Buscar carro:</label>
        <input
          className="input"
          type="text"
          placeholder="Placa, modelo, marca ou dono"
          value={buscaCarro}
          onChange={(e) => setBuscaCarro(e.target.value)}
        />
      </div>

      {/* ===== LISTA DE CARROS ===== */}
      <h2 className="subtitulo">Carros cadastrados</h2>

      <table className="tabela">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Cor</th>
            <th>Dono</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {carrosFiltrados.map((carro) => (
            <tr key={carro.id}>
              <td>
                {carro.fotoUrl ? (
                  <img
                    src={carro.fotoUrl}
                    alt={carro.modelo}
                    className="foto-thumb"
                    onClick={() => setFotoAmpliada(carro.fotoUrl)}
                  />
                ) : (
                  "-"
                )}
              </td>

              <td>{carro.placa}</td>
              <td>{carro.modelo}</td>
              <td>{carro.marca || "-"}</td>
              <td>{carro.cor || "-"}</td>
              <td>{carro.cliente ? carro.cliente.nome : "-"}</td>

              <td className="acoes-cell">
                <button className="btn-historico" onClick={() => verHistorico(carro)}>
                  Histórico
                </button>

                <button className="btn-os" onClick={() => novaOrdemServico(carro)}>
                  Nova OS
                </button>

                <button className="btn-editar" onClick={() => prepararEdicao(carro)}>
                  Editar
                </button>

                <button className="btn-excluir" onClick={() => excluirCarro(carro)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}

          {carrosFiltrados.length === 0 && (
            <tr>
              <td colSpan="7">Nenhum carro encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== MODAL FOTO AMPLIADA ===== */}
      {fotoAmpliada && (
        <div className="modal-foto" onClick={() => setFotoAmpliada(null)}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <img src={fotoAmpliada} alt="Foto ampliada" className="foto-grande" />
            <button className="btn-fechar-modal" onClick={() => setFotoAmpliada(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
