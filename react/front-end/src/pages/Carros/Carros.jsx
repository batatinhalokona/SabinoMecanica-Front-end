import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // <<< IMPORTANTE
import api from "../../api/api";
import "./Carros.css";

export default function Carros() {
  // ===== CAMPOS DO FORMULÁRIO =====
  const [placa, setPlaca] = useState("");        // obrigatório
  const [modelo, setModelo] = useState("");      // obrigatório
  const [marca, setMarca] = useState("");        // opcional
  const [cor, setCor] = useState("");            // opcional

  // Foto do carro (URL opcional)
  const [fotoUrl, setFotoUrl] = useState("");

  // Dono do carro (cliente selecionado)
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [buscaCliente, setBuscaCliente] = useState("");

  // Listas
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);

  // Edição
  const [carroEditandoId, setCarroEditandoId] = useState(null);

  // Busca de carro
  const [buscaCarro, setBuscaCarro] = useState("");

  // Foto ampliada (modal)
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  // Navegação entre telas
  const navigate = useNavigate();

  // Carregar dados ao abrir
  useEffect(() => {
    carregarCarros();
    carregarClientes();
  }, []);

  async function carregarCarros() {
    try {
      const response = await api.get("/carros");
      setCarros(response.data);
    } catch (err) {
      console.log("Erro ao listar carros:", err);
    }
  }

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (err) {
      console.log("Erro ao listar clientes:", err);
    }
  }

  // Salvar (cadastrar ou editar)
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
      clienteId: clienteSelecionado.id,  // depois o back usa esse ID
    };

    try {
      if (carroEditandoId) {
        await api.put(`/carros/${carroEditandoId}`, dadosCarro);
        alert("Carro atualizado com sucesso!");
      } else {
        await api.post("/carros", dadosCarro);
        alert("Carro cadastrado com sucesso!");
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

  // Prepara edição
  function prepararEdicao(carro) {
    setPlaca(carro.placa || "");
    setModelo(carro.modelo || "");
    setMarca(carro.marca || "");
    setCor(carro.cor || "");
    setFotoUrl(carro.fotoUrl || "");

    if (carro.cliente) {
      setClienteSelecionado(carro.cliente);
    } else {
      setClienteSelecionado(null);
    }

    setCarroEditandoId(carro.id);
  }

  // Excluir carro (back vai bloquear se tiver serviço vinculado)
  async function excluirCarro(carro) {
    if (!window.confirm("Tem certeza que deseja excluir este carro?")) {
      return;
    }

    try {
      await api.delete(`/carros/${carro.id}`);
      carregarCarros();
    } catch (err) {
      console.log("Erro ao excluir carro:", err);

      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert("Erro ao excluir carro.");
      }
    }
  }

  // 👉 VER HISTÓRICO DE SERVIÇO DESTE CARRO
  function verHistorico(carro) {
    // vamos mandar o carroId na URL
    navigate(`/servicos?carroId=${carro.id}`);
  }

  // 👉 NOVA ORDEM DE SERVIÇO PARA ESTE CARRO
  function novaOrdemServico(carro) {
    // abre a tela de nova OS com o carro já selecionado
    navigate(`/servicos/novo?carroId=${carro.id}`);
  }

  // Filtro de carros
  const carrosFiltrados = carros.filter((c) => {
    if (!buscaCarro.trim()) return true;
    const texto = buscaCarro.toLowerCase();

    const placaMatch = c.placa?.toLowerCase().includes(texto);
    const modeloMatch = c.modelo?.toLowerCase().includes(texto);
    const marcaMatch = c.marca?.toLowerCase().includes(texto);
    const donoMatch = c.cliente?.nome?.toLowerCase().includes(texto);

    return placaMatch || modeloMatch || marcaMatch || donoMatch;
  });

  // Filtro de clientes (para selecionar dono)
  const clientesFiltrados = clientes.filter((cli) => {
    if (!buscaCliente.trim()) return true;
    const texto = buscaCliente.toLowerCase();

    const nomeMatch = cli.nome?.toLowerCase().includes(texto);
    const telefoneMatch = cli.telefone?.toLowerCase().includes(texto);
    const cpfMatch = cli.cpf?.toLowerCase().includes(texto);

    return nomeMatch || telefoneMatch || cpfMatch;
  });

  return (
    <div className="carros-container">
      <h1 className="titulo">Carros</h1>

      {/* ===== FORMULÁRIO ===== */}
      <form className="form" onSubmit={salvarCarro}>
        {/* Placa */}
        <label className="label">Placa :</label>
        <input
          className="input"
          type="text"
          placeholder="ABC-1D23"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          required
        />

        {/* Modelo */}
        <label className="label">Modelo :</label>
        <input
          className="input"
          type="text"
          placeholder="Modelo do carro"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          required
        />

        {/* Marca */}
        <label className="label">Marca:</label>
        <input
          className="input"
          type="text"
          placeholder="Marca do carro"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />

        {/* Cor */}
        <label className="label">Cor (opcional):</label>
        <input
          className="input"
          type="text"
          placeholder="Cor do carro"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
        />

        {/* Foto */}
        <label className="label">Foto do carro (URL opcional):</label>
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
              alt="Pré-visualização"
              className="foto-preview"
              onClick={() => setFotoAmpliada(fotoUrl)}
            />
          </div>
        )}

        {/* Dono */}
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
                placeholder="Buscar cliente por nome, telefone ou CPF"
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
            <button
              type="button"
              className="btn-cancelar"
              onClick={limparCampos}
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      {/* ===== BUSCA CARRO ===== */}
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

      {/* ===== TABELA ===== */}
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
                <button
                  className="btn-historico"
                  type="button"
                  onClick={() => verHistorico(carro)}
                >
                  Histórico
                </button>

                <button
                  className="btn-os"
                  type="button"
                  onClick={() => novaOrdemServico(carro)}
                >
                  Nova OS
                </button>

                <button
                  className="btn-editar"
                  type="button"
                  onClick={() => prepararEdicao(carro)}
                >
                  Editar
                </button>

                <button
                  className="btn-excluir"
                  type="button"
                  onClick={() => excluirCarro(carro)}
                >
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
            <button
              className="btn-fechar-modal"
              type="button"
              onClick={() => setFotoAmpliada(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
