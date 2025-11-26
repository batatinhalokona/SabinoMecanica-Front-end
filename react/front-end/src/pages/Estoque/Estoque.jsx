import React, { useEffect, useState } from "react";
import "./Estoque.css";
import Modal from "../../components/Modal";
import {
  FaCogs,
  FaPlusCircle,
  FaEdit,
  FaTrash,
  FaBoxOpen,
  FaFlask,
} from "react-icons/fa";

export default function Estoque() {
  // Lista geral de itens (peças e produtos)
  const [itens, setItens] = useState([]);

  // Tipo atual do modal ("peca" ou "produto")
  const [tipoAtual, setTipoAtual] = useState("peca");

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [minimo, setMinimo] = useState("");
  const [local, setLocal] = useState("");
  const [observacao, setObservacao] = useState("");

  // Busca
  const [buscaPecas, setBuscaPecas] = useState("");
  const [buscaProdutos, setBuscaProdutos] = useState("");

  // Modais
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);

  // Item sendo editado
  const [itemEditando, setItemEditando] = useState(null);

  // ============================
  // LocalStorage
  // ============================
  useEffect(() => {
    try {
      const armazenados = JSON.parse(
        localStorage.getItem("estoqueOficina") || "[]"
      );
      setItens(armazenados);
    } catch (e) {
      console.error("Erro ao carregar estoque:", e);
      setItens([]);
    }
  }, []);

  const salvarItens = (lista) => {
    setItens(lista);
    localStorage.setItem("estoqueOficina", JSON.stringify(lista));
  };

  // ============================
  // Abrir modal de cadastro
  // ============================
  const abrirCadastro = (tipo) => {
    setTipoAtual(tipo); // "peca" ou "produto"
    // limpa campos
    setNome("");
    setCategoria("");
    setQuantidade("");
    setMinimo("");
    setLocal("");
    setObservacao("");
    setModalCadastro(true);
  };

  // ============================
  // Cadastrar novo item
  // ============================
  const cadastrarItem = (e) => {
    e.preventDefault();

    if (!nome || !quantidade) {
      alert("Nome e quantidade são obrigatórios.");
      return;
    }

    const novoItem = {
      id: Date.now(),
      tipo: tipoAtual, // "peca" ou "produto"
      nome,
      categoria,
      quantidade: Number(quantidade),
      minimo: minimo ? Number(minimo) : 0,
      local,
      observacao,
    };

    const lista = [novoItem, ...itens];
    salvarItens(lista);

    setModalCadastro(false);
  };

  // ============================
  // Editar item
  // ============================
  const abrirEdicao = (item) => {
    setItemEditando(item);
    setTipoAtual(item.tipo);
    setNome(item.nome);
    setCategoria(item.categoria || "");
    setQuantidade(String(item.quantidade));
    setMinimo(item.minimo != null ? String(item.minimo) : "");
    setLocal(item.local || "");
    setObservacao(item.observacao || "");
    setModalEditar(true);
  };

  const salvarEdicao = (e) => {
    e.preventDefault();
    if (!nome || !quantidade) {
      alert("Nome e quantidade são obrigatórios.");
      return;
    }

    const listaAtualizada = itens.map((i) =>
      i.id === itemEditando.id
        ? {
            ...i,
            nome,
            categoria,
            quantidade: Number(quantidade),
            minimo: minimo ? Number(minimo) : 0,
            local,
            observacao,
          }
        : i
    );

    salvarItens(listaAtualizada);
    setModalEditar(false);
    setItemEditando(null);
  };

  // ============================
  // Excluir item
  // ============================
  const excluirItem = (id) => {
    if (!window.confirm("Deseja realmente excluir este item do estoque?"))
      return;
    const lista = itens.filter((i) => i.id !== id);
    salvarItens(lista);
  };

  // ============================
  // Filtros
  // ============================
  const pecas = itens.filter((i) => i.tipo === "peca");
  const produtos = itens.filter((i) => i.tipo === "produto");

  const aplicarBusca = (lista, termo) => {
    if (!termo) return lista;
    const t = termo.toLowerCase();
    return lista.filter(
      (i) =>
        i.nome.toLowerCase().includes(t) ||
        (i.categoria && i.categoria.toLowerCase().includes(t)) ||
        (i.local && i.local.toLowerCase().includes(t))
    );
  };

  const pecasFiltradas = aplicarBusca(pecas, buscaPecas);
  const produtosFiltrados = aplicarBusca(produtos, buscaProdutos);

  // ============================
  // JSX
  // ============================
  return (
    <div className="estoque-container">
      <div className="estoque-content page-transition-side">
        {/* Cabeçalho */}
        <header className="estoque-header">
          <h1>🧰 Estoque da Oficina Sabino</h1>
          <p>Controle peças e produtos usados no dia a dia da oficina.</p>
        </header>

        {/* Cards principais */}
        <div className="estoque-grid-cards">
          {/* Nova peça */}
          <button
            className="estoque-card estoque-card--peca"
            onClick={() => abrirCadastro("peca")}
          >
            <div className="estoque-card-icone">
              <FaCogs />
            </div>
            <div className="estoque-card-texto">
              <h2>Nova Peça</h2>
              <p>Cadastrar peças novas ou usadas no estoque.</p>
            </div>
          </button>

          {/* Novo produto */}
          <button
            className="estoque-card estoque-card--produto"
            onClick={() => abrirCadastro("produto")}
          >
            <div className="estoque-card-icone">
              <FaFlask />
            </div>
            <div className="estoque-card-texto">
              <h2>Novo Produto</h2>
              <p>Óleos, fluidos, produtos de limpeza e outros.</p>
            </div>
          </button>
        </div>

        {/* ============================
            PEÇAS EM ESTOQUE
        ============================ */}
        <section className="estoque-section">
          <div className="estoque-section-header">
            <h2>🔩 Peças em Estoque</h2>
            <input
              type="text"
              placeholder="Buscar por nome, categoria ou local..."
              value={buscaPecas}
              onChange={(e) => setBuscaPecas(e.target.value)}
            />
          </div>

          {pecasFiltradas.length === 0 ? (
            <p className="texto-vazio-estoque">
              Nenhuma peça cadastrada no momento.
            </p>
          ) : (
            <div className="estoque-lista">
              {pecasFiltradas.map((i) => (
                <div
                  key={i.id}
                  className={`estoque-item-card ${
                    i.minimo && i.quantidade <= i.minimo
                      ? "estoque-item-card--critico"
                      : ""
                  }`}
                >
                  <div className="estoque-item-info">
                    <div className="estoque-item-nome">
                      <FaBoxOpen className="estoque-item-icone" />
                      <div>
                        <strong>{i.nome}</strong>
                        {i.categoria && (
                          <p className="estoque-item-linha">
                            Categoria: {i.categoria}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="estoque-item-linha">
                      Qtd:{" "}
                      <strong>
                        {i.quantidade}
                        {i.minimo
                          ? ` (mínimo recomendado: ${i.minimo})`
                          : ""}
                      </strong>
                    </p>
                    {i.local && (
                      <p className="estoque-item-linha">
                        Local: {i.local}
                      </p>
                    )}
                    {i.observacao && (
                      <p className="estoque-item-linha">
                        Obs.: {i.observacao}
                      </p>
                    )}
                  </div>

                  <div className="estoque-item-acoes">
                    <button
                      className="btn-mini-edit"
                      onClick={() => abrirEdicao(i)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-mini-delete"
                      onClick={() => excluirItem(i.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ============================
            PRODUTOS EM ESTOQUE
        ============================ */}
        <section className="estoque-section">
          <div className="estoque-section-header">
            <h2>🛢️ Produtos em Estoque</h2>
            <input
              type="text"
              placeholder="Buscar por nome, categoria ou local..."
              value={buscaProdutos}
              onChange={(e) => setBuscaProdutos(e.target.value)}
            />
          </div>

          {produtosFiltrados.length === 0 ? (
            <p className="texto-vazio-estoque">
              Nenhum produto cadastrado no momento.
            </p>
          ) : (
            <div className="estoque-lista">
              {produtosFiltrados.map((i) => (
                <div
                  key={i.id}
                  className={`estoque-item-card ${
                    i.minimo && i.quantidade <= i.minimo
                      ? "estoque-item-card--critico"
                      : ""
                  }`}
                >
                  <div className="estoque-item-info">
                    <div className="estoque-item-nome">
                      <FaBoxOpen className="estoque-item-icone" />
                      <div>
                        <strong>{i.nome}</strong>
                        {i.categoria && (
                          <p className="estoque-item-linha">
                            Categoria: {i.categoria}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="estoque-item-linha">
                      Qtd:{" "}
                      <strong>
                        {i.quantidade}
                        {i.minimo
                          ? ` (mínimo recomendado: ${i.minimo})`
                          : ""}
                      </strong>
                    </p>
                    {i.local && (
                      <p className="estoque-item-linha">
                        Local: {i.local}
                      </p>
                    )}
                    {i.observacao && (
                      <p className="estoque-item-linha">
                        Obs.: {i.observacao}
                      </p>
                    )}
                  </div>

                  <div className="estoque-item-acoes">
                    <button
                      className="btn-mini-edit"
                      onClick={() => abrirEdicao(i)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-mini-delete"
                      onClick={() => excluirItem(i.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ============================
          MODAL CADASTRO
      ============================ */}
      <Modal
        isOpen={modalCadastro}
        onClose={() => setModalCadastro(false)}
        title={
          tipoAtual === "peca" ? "Cadastrar Nova Peça" : "Cadastrar Novo Produto"
        }
      >
        <form className="estoque-form" onSubmit={cadastrarItem}>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Categoria (opcional):</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          <label>Quantidade:</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <label>Quantidade mínima (opcional):</label>
          <input
            type="number"
            value={minimo}
            onChange={(e) => setMinimo(e.target.value)}
          />

          <label>Local no estoque (opcional):</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />

          <label>Observação (opcional):</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />

          <button type="submit" className="btn-principal">
            Salvar
          </button>
        </form>
      </Modal>

      {/* ============================
          MODAL EDIÇÃO
      ============================ */}
      <Modal
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        title="Editar Item do Estoque"
      >
        <form className="estoque-form" onSubmit={salvarEdicao}>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Categoria (opcional):</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          <label>Quantidade:</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <label>Quantidade mínima (opcional):</label>
          <input
            type="number"
            value={minimo}
            onChange={(e) => setMinimo(e.target.value)}
          />

          <label>Local no estoque (opcional):</label>
          <input
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />

          <label>Observação (opcional):</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />

          <button type="submit" className="btn-principal">
            Salvar alterações
          </button>
        </form>
      </Modal>
    </div>
  );
}
