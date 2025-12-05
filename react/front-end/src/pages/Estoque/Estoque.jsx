// src/pages/Estoque.jsx
import React, { useEffect, useState } from "react";
import "./Estoque.css";

export default function Estoque() {
  // ============================
  // CHAVE DO LOCALSTORAGE
  // ============================
  const STORAGE_KEY = "estoqueOficinaSabino";

  // ============================
  // FORMULÁRIO (NOVO ITEM)
  // ============================
  const [tipoItem, setTipoItem] = useState("PRODUTO"); // "PRODUTO" ou "PECA"
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [quantidade, setQuantidade] = useState(0);

  // ============================
  // LISTA DE ITENS (PRODUTO + PEÇA)
  // ============================
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");

  // ============================
  // FUNÇÕES AUXILIARES LOCALSTORAGE
  // ============================
  function carregarDoStorage() {
    try {
      const dados = localStorage.getItem(STORAGE_KEY);
      if (!dados) return [];
      const parsed = JSON.parse(dados);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.log("Erro ao ler localStorage do estoque:", e);
      return [];
    }
  }

  function salvarNoStorage(lista) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
      console.log("Erro ao salvar estoque no localStorage:", e);
    }
  }

  // ============================
  // CARREGAR AO ABRIR A PÁGINA
  // ============================
  useEffect(() => {
    const lista = carregarDoStorage();
    setItens(lista);
  }, []);

  // ============================
  // SALVAR NOVO PRODUTO / PEÇA (SOMENTE FRONT)
  // ============================
  function salvarNovoItem(e) {
    e.preventDefault();

    if (!nome.trim()) {
      alert("Informe o nome.");
      return;
    }

    // cria um id simples no front (timestamp + random)
    const id = Date.now().toString() + Math.random().toString(16).slice(2);

    const novoItem = {
      id,
      tipoItem, // "PRODUTO" ou "PECA"
      nome,
      descricao: descricao || null,
      precoCusto: tipoItem === "PRODUTO" ? Number(precoCusto) || 0 : 0,
      precoVenda: Number(precoVenda) || 0,
      quantidade: Number(quantidade) || 0,
    };

    const novaLista = [...itens, novoItem];
    setItens(novaLista);
    salvarNoStorage(novaLista);

    // limpa form
    setTipoItem("PRODUTO");
    setNome("");
    setDescricao("");
    setPrecoCusto("");
    setPrecoVenda("");
    setQuantidade(0);
  }

  // ============================
  // ATUALIZAR ITEM (PREÇO / QTD) NO FRONT
  // ============================
  function atualizarItem(itemAtualizado) {
    const novaLista = itens.map((i) =>
      i.id === itemAtualizado.id ? itemAtualizado : i
    );
    setItens(novaLista);
    salvarNoStorage(novaLista);
  }

  // alterar preços (custo ou venda) só no state
  function alterarPrecoLocal(idItem, campo, valor) {
    const novaLista = itens.map((i) =>
      i.id === idItem ? { ...i, [campo]: Number(valor) || 0 } : i
    );
    setItens(novaLista);
    salvarNoStorage(novaLista);
  }

  // +1 / -1 na quantidade
  function alterarQuantidade(idItem, delta) {
    const novaLista = itens.map((i) => {
      if (i.id !== idItem) return i;

      const novaQtd = (i.quantidade || 0) + delta;
      if (novaQtd < 0) return i; // não deixa negativo

      return { ...i, quantidade: novaQtd };
    });

    setItens(novaLista);
    salvarNoStorage(novaLista);
  }

  // botão "Salvar" da linha (na prática já está salvo, mas mantém padrão)
  function salvarLinha(item) {
    atualizarItem(item);
    alert("Item atualizado no estoque (front)!");
  }

  // ============================
  // FILTRO POR TEXTO
  // ============================
  const itensFiltrados = itens.filter((i) => {
    if (!busca.trim()) return true;
    const txt = busca.toLowerCase();
    return (
      i.nome?.toLowerCase().includes(txt) ||
      i.descricao?.toLowerCase().includes(txt)
    );
  });

  // separa em PRODUTOS e PEÇAS
  const produtos = itensFiltrados.filter(
    (i) => i.tipoItem === "PRODUTO" || !i.tipoItem // default produto
  );
  const pecas = itensFiltrados.filter((i) => i.tipoItem === "PECA");

  // ============================
  // JSX
  // ============================
  return (
    <div className="estoque-container">
      <h1 className="titulo-estoque">Estoque</h1>

      {/* ========== CADASTRO ========== */}
      <div className="secao-estoque">
        <h2 className="secao-titulo-estoque">Cadastrar produto / peça</h2>

        <form className="form-estoque" onSubmit={salvarNovoItem}>
          <div className="grupo-horizontal-estoque">
            {/* Tipo: Produto ou Peça */}
            <div className="campo-flex-estoque">
              <label className="label-estoque">Tipo:</label>
              <select
                className="input-estoque"
                value={tipoItem}
                onChange={(e) => setTipoItem(e.target.value)}
              >
                <option value="PRODUTO">Produto</option>
                <option value="PECA">Peça</option>
              </select>
            </div>

            {/* Nome */}
            <div className="campo-flex-estoque">
              <label className="label-estoque">Nome:</label>
              <input
                className="input-estoque"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Óleo 5W30, Filtro de óleo..."
              />
            </div>

            {/* Descrição só aparece para PEÇA */}
            {tipoItem === "PECA" && (
              <div className="campo-flex-estoque">
                <label className="label-estoque">Descrição:</label>
                <input
                  className="input-estoque"
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: dianteiro, traseiro, lado direito..."
                />
              </div>
            )}
          </div>

          <div className="grupo-horizontal-estoque">
            {/* Preço de custo só para PRODUTO */}
            {tipoItem === "PRODUTO" && (
              <div className="campo-flex-estoque">
                <label className="label-estoque">Preço pago (custo):</label>
                <input
                  className="input-estoque"
                  type="number"
                  step="0.01"
                  value={precoCusto}
                  onChange={(e) => setPrecoCusto(e.target.value)}
                  placeholder="0,00"
                />
              </div>
            )}

            {/* Preço de venda / preço único */}
            <div className="campo-flex-estoque">
              <label className="label-estoque">
                {tipoItem === "PRODUTO" ? "Preço de venda:" : "Preço:"}
              </label>
              <input
                className="input-estoque"
                type="number"
                step="0.01"
                value={precoVenda}
                onChange={(e) => setPrecoVenda(e.target.value)}
                placeholder="0,00"
              />
            </div>

            {/* Quantidade inicial */}
            <div className="campo-flex-estoque">
              <label className="label-estoque">Quantidade inicial:</label>
              <input
                className="input-estoque"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="botoes-form-estoque">
            <button className="btn-salvar-estoque" type="submit">
              Salvar
            </button>
          </div>
        </form>
      </div>

      {/* ========== FILTRO GERAL ========== */}
      <div className="secao-estoque">
        <div className="filtro-estoque">
          <label className="label-estoque">
            Buscar por nome ou descrição:
          </label>
          <input
            className="input-estoque"
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite para filtrar..."
          />
        </div>
      </div>

      {/* ========== TABELA PRODUTOS ========== */}
      <div className="secao-estoque">
        <h2 className="secao-titulo-estoque">Produtos cadastrados</h2>

        <table className="tabela-estoque">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço pago</th>
              <th>Preço venda</th>
              <th>Quantidade</th>
              <th>Ajustar</th>
              <th>Salvar</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>

                {/* Preço pago (custo) editável */}
                <td>
                  <input
                    className="input-preco-tabela"
                    type="number"
                    step="0.01"
                    value={p.precoCusto != null ? p.precoCusto : ""}
                    onChange={(e) =>
                      alterarPrecoLocal(p.id, "precoCusto", e.target.value)
                    }
                  />
                </td>

                {/* Preço venda editável */}
                <td>
                  <input
                    className="input-preco-tabela"
                    type="number"
                    step="0.01"
                    value={p.precoVenda != null ? p.precoVenda : ""}
                    onChange={(e) =>
                      alterarPrecoLocal(p.id, "precoVenda", e.target.value)
                    }
                  />
                </td>

                {/* Quantidade */}
                <td>{p.quantidade != null ? p.quantidade : 0}</td>

                {/* Botões +1 / -1 */}
                <td>
                  <div className="grupo-botoes-qtd">
                    <button
                      type="button"
                      className="btn-qtd"
                      onClick={() => alterarQuantidade(p.id, -1)}
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      className="btn-qtd"
                      onClick={() => alterarQuantidade(p.id, +1)}
                    >
                      +1
                    </button>
                  </div>
                </td>

                {/* Botão salvar */}
                <td>
                  <button
                    type="button"
                    className="btn-salvar-linha"
                    onClick={() => salvarLinha(p)}
                  >
                    Salvar
                  </button>
                </td>
              </tr>
            ))}

            {produtos.length === 0 && (
              <tr>
                <td colSpan="6">Nenhum produto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========== TABELA PEÇAS ========== */}
      <div className="secao-estoque">
        <h2 className="secao-titulo-estoque">Peças cadastradas</h2>

        <table className="tabela-estoque">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Ajustar</th>
              <th>Salvar</th>
            </tr>
          </thead>
          <tbody>
            {pecas.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.descricao || "-"}</td>

                {/* Preço único da peça */}
                <td>
                  <input
                    className="input-preco-tabela"
                    type="number"
                    step="0.01"
                    value={p.precoVenda != null ? p.precoVenda : ""}
                    onChange={(e) =>
                      alterarPrecoLocal(p.id, "precoVenda", e.target.value)
                    }
                  />
                </td>

                {/* Quantidade */}
                <td>{p.quantidade != null ? p.quantidade : 0}</td>

                {/* Botões +1 / -1 */}
                <td>
                  <div className="grupo-botoes-qtd">
                    <button
                      type="button"
                      className="btn-qtd"
                      onClick={() => alterarQuantidade(p.id, -1)}
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      className="btn-qtd"
                      onClick={() => alterarQuantidade(p.id, +1)}
                    >
                      +1
                    </button>
                  </div>
                </td>

                {/* Botão salvar */}
                <td>
                  <button
                    type="button"
                    className="btn-salvar-linha"
                    onClick={() => salvarLinha(p)}
                  >
                    Salvar
                  </button>
                </td>
              </tr>
            ))}

            {pecas.length === 0 && (
              <tr>
                <td colSpan="6">Nenhuma peça cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
