import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./Clientes.css";

export default function Clientes() {
  // Campos do formulário
  const [nome, setNome] = useState("");          // obrigatório
  const [telefone, setTelefone] = useState("");  // obrigatório
  const [cpf, setCpf] = useState("");            // opcional
  const [situacao, setSituacao] = useState("ATIVO"); // ATIVO ou INATIVO

  // Lista de clientes vinda do back
  const [clientes, setClientes] = useState([]);

  // Texto da busca
  const [busca, setBusca] = useState("");

  // Controle de edição (null = cadastrando, id = editando)
  const [clienteEditandoId, setClienteEditandoId] = useState(null);

  // Paginação
  const ITENS_POR_PAGINA = 10;
  const [paginaAtivos, setPaginaAtivos] = useState(1);
  const [paginaInativos, setPaginaInativos] = useState(1);

  // Carrega clientes ao abrir a tela
  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
      // Sempre volta pra página 1 quando recarregar
      setPaginaAtivos(1);
      setPaginaInativos(1);
    } catch (err) {
      console.log("Erro ao listar clientes:", err);
    }
  }

  // Cadastrar ou atualizar cliente
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
      if (clienteEditandoId) {
        // Modo edição
        await api.put(`/clientes/${clienteEditandoId}`, dadosCliente);
        alert("Cliente atualizado com sucesso!");
      } else {
        // Modo cadastro
        await api.post("/clientes", dadosCliente);
        alert("Cliente cadastrado com sucesso!");
      }

      carregarClientes();
      limparCampos();
    } catch (err) {
      console.log("Erro ao salvar cliente:", err);
      alert("Erro ao salvar cliente.");
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
    setNome(cliente.nome || "");
    setTelefone(cliente.telefone || "");
    setCpf(cliente.cpf || "");
    setSituacao(cliente.situacao || "ATIVO");
    setClienteEditandoId(cliente.id);
  }

  // Exclusão: regra de bloqueio fica no back
  async function excluirCliente(cliente) {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) {
      return;
    }

    try {
      await api.delete(`/clientes/${cliente.id}`);
      carregarClientes();
    } catch (err) {
      console.log("Erro ao excluir cliente:", err);

      if (err.response && err.response.data) {
        alert(err.response.data); // mensagem do back (ex: tem carro vinculado)
      } else {
        alert("Erro ao excluir cliente.");
      }
    }
  }

  // Filtro da busca (nome, telefone ou CPF)
  const clientesFiltrados = clientes.filter((c) => {
    if (!busca.trim()) return true;

    const texto = busca.toLowerCase();
    const nomeMatch = c.nome?.toLowerCase().includes(texto);
    const telMatch = c.telefone?.toLowerCase().includes(texto);
    const cpfMatch = c.cpf?.toLowerCase().includes(texto);

    return nomeMatch || telMatch || cpfMatch;
  });

  // Separa ativos e inativos
  const clientesAtivos = clientesFiltrados.filter(
    (c) => c.situacao === "ATIVO"
  );
  const clientesInativos = clientesFiltrados.filter(
    (c) => c.situacao === "INATIVO"
  );

  // ===== PAGINAÇÃO ATIVOS =====
  const totalPaginasAtivos = Math.max(
    1,
    Math.ceil(clientesAtivos.length / ITENS_POR_PAGINA)
  );
  const indexInicialAtivos = (paginaAtivos - 1) * ITENS_POR_PAGINA;
  const indexFinalAtivos = indexInicialAtivos + ITENS_POR_PAGINA;
  const ativosPagina = clientesAtivos.slice(indexInicialAtivos, indexFinalAtivos);

  // Garante que a página não fique fora do limite se a lista mudar
  useEffect(() => {
    if (paginaAtivos > totalPaginasAtivos) {
      setPaginaAtivos(totalPaginasAtivos);
    }
  }, [totalPaginasAtivos, paginaAtivos]);

  // ===== PAGINAÇÃO INATIVOS =====
  const totalPaginasInativos = Math.max(
    1,
    Math.ceil(clientesInativos.length / ITENS_POR_PAGINA)
  );
  const indexInicialInativos = (paginaInativos - 1) * ITENS_POR_PAGINA;
  const indexFinalInativos = indexInicialInativos + ITENS_POR_PAGINA;
  const inativosPagina = clientesInativos.slice(indexInicialInativos, indexFinalInativos);

  useEffect(() => {
    if (paginaInativos > totalPaginasInativos) {
      setPaginaInativos(totalPaginasInativos);
    }
  }, [totalPaginasInativos, paginaInativos]);

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
              Cancelar Edição
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
            // Sempre volta pra primeira página ao mudar a busca
            setPaginaAtivos(1);
            setPaginaInativos(1);
          }}
        />
      </div>

      {/* CLIENTES ATIVOS */}
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

      {/* CONTROLES PAGINAÇÃO ATIVOS */}
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

      {/* CLIENTES INATIVOS */}
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

      {/* CONTROLES PAGINAÇÃO INATIVOS */}
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
              setPaginaInativos((p) => Math.min(totalPaginasInativos, p + 1))
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
