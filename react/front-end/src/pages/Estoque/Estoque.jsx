import React, { useEffect, useState } from "react";
import "./Estoque.css";
import Modal from "../../components/Modal";
import {
  FaPlus,
  FaTrash,
  FaSearch,
  FaMinus,
  FaPlusCircle,
  FaBox,
  FaTools,
  FaOilCan,
} from "react-icons/fa";

export default function Estoque() {
  const [estoque, setEstoque] = useState([]);
  const [modalPeça, setModalPeça] = useState(false);
  const [modalProduto, setModalProduto] = useState(false);
  const [busca, setBusca] = useState("");
  const [animar, setAnimar] = useState(false);

  // Campos Peça
  const [nomePeca, setNomePeca] = useState("");
  const [marcaPeca, setMarcaPeca] = useState("");
  const [valorPeca, setValorPeca] = useState("");
  const [qtdPeca, setQtdPeca] = useState("");

  // Campos Produto
  const [nomeProduto, setNomeProduto] = useState("");
  const [tipoProduto, setTipoProduto] = useState("");
  const [valorProduto, setValorProduto] = useState("");
  const [qtdProduto, setQtdProduto] = useState("");

  // =============================
  //   LocalStorage
  // =============================
  useEffect(() => {
    setAnimar(true);
    const dados = JSON.parse(localStorage.getItem("estoque") || "[]");
    setEstoque(dados);
  }, []);

  const salvarEstoque = (lista) => {
    setEstoque(lista);
    localStorage.setItem("estoque", JSON.stringify(lista));
  };

  // =============================
  //   Cadastro Peça
  // =============================
  const cadastrarPeca = (e) => {
    e.preventDefault();
    if (!nomePeca || !marcaPeca || !valorPeca || !qtdPeca) {
      alert("Preencha todos os campos da peça.");
      return;
    }

    const novo = {
      id: Date.now(),
      nome: nomePeca,
      marca: marcaPeca,
      valor: Number(valorPeca),
      quantidade: Number(qtdPeca),
      categoria: "peca",
    };

    salvarEstoque([...estoque, novo]);
    setNomePeca("");
    setMarcaPeca("");
    setValorPeca("");
    setQtdPeca("");
    setModalPeça(false);
  };

  // =============================
  //   Cadastro Produto
  // =============================
  const cadastrarProduto = (e) => {
    e.preventDefault();
    if (!nomeProduto || !tipoProduto || !valorProduto || !qtdProduto) {
      alert("Preencha todos os campos do produto.");
      return;
    }

    const novo = {
      id: Date.now(),
      nome: nomeProduto,
      tipo: tipoProduto,
      valor: Number(valorProduto),
      quantidade: Number(qtdProduto),
      categoria: "produto",
    };

    salvarEstoque([...estoque, novo]);

    setNomeProduto("");
    setTipoProduto("");
    setValorProduto("");
    setQtdProduto("");
    setModalProduto(false);
  };

  // =============================
  //   Ações: +1, -1, Excluir
  // =============================
  const aumentar = (item) => {
    const lista = estoque.map((i) =>
      i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i
    );
    salvarEstoque(lista);
  };

  const diminuir = (item) => {
    if (item.quantidade === 0) return;
    const lista = estoque.map((i) =>
      i.id === item.id ? { ...i, quantidade: i.quantidade - 1 } : i
    );
    salvarEstoque(lista);
  };

  const excluirItem = (id) => {
    if (window.confirm("Deseja excluir este item ?")) {
      salvarEstoque(estoque.filter((i) => i.id !== id));
    }
  };

  // =============================
  //   Filtro de busca
  // =============================
  const aplicarBusca = (lista) => {
    if (!busca) return lista;
    const termo = busca.toLowerCase();
    return lista.filter((i) => i.nome.toLowerCase().includes(termo));
  };

  // Separando Listas
  const pecas = aplicarBusca(estoque.filter((i) => i.categoria === "peca"));
  const produtos = aplicarBusca(estoque.filter((i) => i.categoria === "produto"));

  return (
    <div className="estoque-container">
      <div className={`estoque-content page-transition-side`}>
        <h1 className="titulo-estoque">📦 Estoque da Oficina Sabino</h1>

        <div className="estoque-grid">
          {/* ===== CADASTRAR PEÇA ===== */}
          <button className="estoque-card" onClick={() => setModalPeça(true)}>
            <FaTools className="icone-card-est" />
            <p>Cadastrar Peça</p>
          </button>

          {/* ===== CADASTRAR PRODUTO ===== */}
          <button className="estoque-card" onClick={() => setModalProduto(true)}>
            <FaBox className="icone-card-est" />
            <p>Cadastrar Produto</p>
          </button>

          {/* ===== LISTAR PEÇAS ===== */}
          <button
            className="estoque-card"
            onClick={() => alert("Role a página para baixo até a lista de peças.")}
          >
            <FaOilCan className="icone-card-est" />
            <p>Peças Cadastradas</p>
          </button>

          {/* ===== LISTAR PRODUTOS ===== */}
          <button
            className="estoque-card"
            onClick={() => alert("Role a página para baixo até a lista de produtos.")}
          >
            <FaOilCan className="icone-card-est" />
            <p>Produtos Cadastrados</p>
          </button>
        </div>

        {/* ===== BUSCA ===== */}
        <div className="area-busca">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar no estoque..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* ===== LISTA DE PEÇAS ===== */}
        <h2 className="titulo-lista">🔧 Peças</h2>
        {pecas.length === 0 ? (
          <p className="texto-vazio">Nenhuma peça cadastrada.</p>
        ) : (
          pecas.map((item) => (
            <div key={item.id} className="card-item">
              <strong>{item.nome}</strong> <span>({item.marca})</span>
              <span> R$ {item.valor.toFixed(2)}</span>
              <div className="estoque-qtd">
                <button onClick={() => diminuir(item)}>
                  <FaMinus />
                </button>
                <span>{item.quantidade}</span>
                <button onClick={() => aumentar(item)}>
                  <FaPlus />
                </button>
              </div>
              <button className="btn-delete" onClick={() => excluirItem(item.id)}>
                <FaTrash />
              </button>
            </div>
          ))
        )}

        {/* ===== LISTA DE PRODUTOS ===== */}
        <h2 className="titulo-lista">📦 Produtos</h2>
        {produtos.length === 0 ? (
          <p className="texto-vazio">Nenhum produto cadastrado.</p>
        ) : (
          produtos.map((item) => (
            <div key={item.id} className="card-item">
              <strong>{item.nome}</strong> <span>({item.tipo})</span>
              <span> R$ {item.valor.toFixed(2)}</span>
              <div className="estoque-qtd">
                <button onClick={() => diminuir(item)}>
                  <FaMinus />
                </button>
                <span>{item.quantidade}</span>
                <button onClick={() => aumentar(item)}>
                  <FaPlus />
                </button>
              </div>
              <button className="btn-delete" onClick={() => excluirItem(item.id)}>
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ===============================
          MODAL CADASTRO PEÇA
      =============================== */}
      <Modal isOpen={modalPeça} onClose={() => setModalPeça(false)} title="Cadastrar Peça">
        <form className="estoque-form" onSubmit={cadastrarPeca}>
          <label>Nome:</label>
          <input type="text" value={nomePeca} onChange={(e) => setNomePeca(e.target.value)} />

          <label>Marca:</label>
          <input type="text" value={marcaPeca} onChange={(e) => setMarcaPeca(e.target.value)} />

          <label>Valor (R$):</label>
          <input type="number" value={valorPeca} onChange={(e) => setValorPeca(e.target.value)} />

          <label>Quantidade:</label>
          <input type="number" value={qtdPeca} onChange={(e) => setQtdPeca(e.target.value)} />

          <button className="btn-principal" type="submit">
            Salvar Peça
          </button>
        </form>
      </Modal>

      {/* ===============================
          MODAL CADASTRO PRODUTO
      =============================== */}
      <Modal isOpen={modalProduto} onClose={() => setModalProduto(false)} title="Cadastrar Produto">
        <form className="estoque-form" onSubmit={cadastrarProduto}>
          <label>Nome:</label>
          <input type="text" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} />

          <label>Tipo:</label>
          <input type="text" value={tipoProduto} onChange={(e) => setTipoProduto(e.target.value)} />

          <label>Valor (R$):</label>
          <input type="number" value={valorProduto} onChange={(e) => setValorProduto(e.target.value)} />

          <label>Quantidade:</label>
          <input type="number" value={qtdProduto} onChange={(e) => setQtdProduto(e.target.value)} />

          <button className="btn-principal" type="submit">
            Salvar Produto
          </button>
        </form>
      </Modal>
    </div>
  );
}
