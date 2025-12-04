// src/pages/Clientes/Clientes.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./Clientes.css";

export default function Clientes() {
  // Campos do formulário
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [situacao, setSituacao] = useState("ATIVO");

  // Lista de clientes
  const [clientes, setClientes] = useState([]);

  // Busca
  const [busca, setBusca] = useState("");

  // Edição
  const [clienteEditandoId, setClienteEditandoId] = useState(null);

  // Paginação
  const ITENS_POR_PAGINA = 10;
  const [paginaAtivos, setPaginaAtivos] = useState(1);
  const [paginaInativos, setPaginaInativos] = useState(1);

  // Carrega clientes ao iniciar
  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");

      console.log("RESPOSTA /clientes:", response.data);

      // Garante que seja array
      const data = response.data;
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];

      const tratados = lista.map((c) => ({
        id: c.id,
        nome: c.nome,
        telefone: c.telefone,
        cpf: c.cpf,
        situacao: c.situacao,
      }));

      console.log("Clientes salvos no estado:", tratados);

      setClientes(tratados);
      setPaginaAtivos(1);
      setPaginaInativos(1);
    } catch (err) {
      console.error("Erro ao listar clientes:", err);
      setClientes([]);
    }
  }

  // Salvar cliente (cadastrar / editar)
  async function salvarCliente(e) {
    e.preventDefault();

    if (!nome.trim() || !telefone.trim()) {
      alert("Nome e telefone são obrigatórios!");
      return;
    }

    const dadosCliente = {
      nome,
      telefone,
      cpf: cpf || null,
      situacao,
    };

    try {
      let resposta;

      if (clienteEditandoId) {
        resposta = await api.put(`/clientes/${clienteEditandoId}`, dadosCliente);
      } else {
        resposta = await api.post("/clientes", dadosCliente);
      }

      console.log("Resposta do backend ao salvar:", resposta.data);

      alert(clienteEditandoId ? "Cliente atualizado!" : "Cliente cadastrado!");

      carregarClientes();
      limparCampos();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Erro do servidor:", err.response.data);
        alert("Erro ao salvar cliente: " + JSON.stringify(err.response.data));
      } else if (err.request) {
        console.error("Sem resposta do servidor:", err.request);
        alert("Servidor não respondeu.");
      } else {
        console.error("Erro desconhecido:", err.message);
        alert("Erro ao salvar cliente: " + err.message);
      }
    }
  }

  function limparCampos() {
    setNome("");
    setTelefone("");
    setCpf("");
    setSituacao("ATIVO");
    setClienteEditandoId(null);
  }

  function prepararEdicao(cliente) {
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setCpf(cliente.cpf || "");
    setSituacao(cliente.situacao || "ATIVO");
    setClienteEditandoId(cliente.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirCliente(cliente) {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await api.delete(`/clientes/${cliente.id}`);
      carregarClientes();
    } catch (err) {
      console.error("Erro ao excluir:", err);

      if (err.response?.data) {
        alert(err.response.data);
      } else {
        alert("Erro ao excluir cliente.");
      }
    }
  }

  // FILTRO DE BUSCA
  const clientesFiltrados = clientes.filter((c) => {
    if (!busca.trim()) return true;
    const texto = busca.toLowerCase();

    return (
      c.nome?.toLowerCase().includes(texto) ||
      c.telefone?.toLowerCase().includes(texto) ||
      c.cpf?.toLowerCase().includes(texto)
    );
  });

  const clientesAtivos = clientesFiltrados.filter((c) => c.situacao === "ATIVO");
  const clientesInativos = clientesFiltrados.filter(
    (c) => c.situacao === "INATIVO"
  );

  // PAGINAÇÃO ATIVOS
  const totalPaginasAtivos = Math.max(
    1,
    Math.ceil(clientesAtivos.length / ITENS_POR_PAGINA)
  );
  const indexInicioAtivos = (paginaAtivos - 1) * ITENS_POR_PAGINA;
  const ativosPagina = clientesAtivos.slice(
    indexInicioAtivos,
    indexInicioAtivos + ITENS_POR_PAGINA
  );

  // PAGINAÇÃO INATIVOS
  const totalPaginasInativos = Math.max(
    1,
    Math.ceil(clientesInativos.length / ITENS_POR_PAGINA)
  );
  const indexInicioInativos = (paginaInativos - 1) * ITENS_POR_PAGINA;
  const inativosPagina = clientesInativos.slice(
    indexInicioInativos,
    indexInicioInativos + ITENS_POR_PAGINA
  );

  return (
    <div className="clientes-container">
      <h1 className="titulo">Clientes</h1>

      {/* FORMULÁRIO */}
      <form className="form" onSubmit={salvarCliente}>
        <label className="label">Nome :</label>
        <input
          className="input"
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label className="label">Telefone :</label>
        <input
          className="input"
          type="text"
          placeholder="(00) 00000-0000"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />

        <label className="label">CPF (opcional):</label>
        <input
          className="input"
          type="text"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        <label className="label">Situação:</label>
        <div className="toggle-wrapper">
          <button
            type="button"
            className={situacao === "ATIVO" ? "toggle active" : "toggle"}
            onClick={() => setSituacao("ATIVO")}
          >
            Ativo
          </button>

          <button
            type="button"
            className={situacao === "INATIVO" ? "toggle inactive" : "toggle"}
            onClick={() => setSituacao("INATIVO")}
          >
            Inativo
          </button>
        </div>

        <div className="botoes-form">
          <button className="btn-cadastrar" type="submit">
            {clienteEditandoId ? "Salvar Alterações" : "Cadastrar Cliente"}
          </button>

          {clienteEditandoId && (
            <button
              type="button"
              className="btn-cancelar"
              onClick={limparCampos}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* BUSCA */}
      <div className="busca-container">
        <label className="label">Buscar cliente:</label>
        <input
          className="input"
          type="text"
          placeholder="Nome, telefone ou CPF"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPaginaAtivos(1);
            setPaginaInativos(1);
          }}
        />
      </div>

      {/* LISTA ATIVOS */}
      <h2 className="subtitulo">Clientes Ativos</h2>
      <table className="tabela tabela-secundaria">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>CPF</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {ativosPagina.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.telefone}</td>
              <td>{c.cpf || "-"}</td>
              <td>
                <button
                  className="btn-editar"
                  type="button"
                  onClick={() => prepararEdicao(c)}
                >
                  Editar
                </button>

                <button
                  className="btn-excluir"
                  type="button"
                  onClick={() => excluirCliente(c)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}

          {clientesAtivos.length === 0 && (
            <tr>
              <td colSpan="4">Nenhum cliente ativo encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINAÇÃO ATIVOS */}
      {clientesAtivos.length > 0 && (
        <div className="paginacao">
          <button
            type="button"
            onClick={() => setPaginaAtivos((p) => Math.max(1, p - 1))}
            disabled={paginaAtivos === 1}
          >
            ◀ Anterior
          </button>

          <span>
            Página {paginaAtivos} de {totalPaginasAtivos}
          </span>

          <button
            type="button"
            onClick={() =>
              setPaginaAtivos((p) => Math.min(totalPaginasAtivos, p + 1))
            }
            disabled={paginaAtivos === totalPaginasAtivos}
          >
            Próxima ▶
          </button>
        </div>
      )}

      {/* LISTA INATIVOS */}
      <h2 className="subtitulo inativo">Clientes Inativos</h2>
      <table className="tabela tabela-secundaria">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>CPF</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {inativosPagina.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.telefone}</td>
              <td>{c.cpf || "-"}</td>
              <td>
                <button
                  className="btn-editar"
                  type="button"
                  onClick={() => prepararEdicao(c)}
                >
                  Editar
                </button>

                <button
                  className="btn-excluir"
                  type="button"
                  onClick={() => excluirCliente(c)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}

          {clientesInativos.length === 0 && (
            <tr>
              <td colSpan="4">Nenhum cliente inativo encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINAÇÃO INATIVOS */}
      {clientesInativos.length > 0 && (
        <div className="paginacao">
          <button
            type="button"
            onClick={() => setPaginaInativos((p) => Math.max(1, p - 1))}
            disabled={paginaInativos === 1}
          >
            ◀ Anterior
          </button>

          <span>
            Página {paginaInativos} de {totalPaginasInativos}
          </span>

          <button
            type="button"
            onClick={() =>
              setPaginaInativos((p) =>
                Math.min(totalPaginasInativos, p + 1)
              )
            }
            disabled={paginaInativos === totalPaginasInativos}
          >
            Próxima ▶
          </button>
        </div>
      )}
    </div>
  );
}
