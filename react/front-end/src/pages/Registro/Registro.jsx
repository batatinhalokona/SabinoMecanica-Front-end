import React, { useEffect, useState } from "react";
import "./Registro.css";
import Modal from "../../components/Modal";
import { FaCamera, FaBook, FaPlus, FaTrash, FaSearch } from "react-icons/fa";

export default function Registro() {
  const [fotos, setFotos] = useState([]);
  const [anotacoes, setAnotacoes] = useState([]);
  const [modalFoto, setModalFoto] = useState(false);
  const [modalNota, setModalNota] = useState(false);
  const [tituloFoto, setTituloFoto] = useState("");
  const [imagemBase64, setImagemBase64] = useState("");
  const [tituloNota, setTituloNota] = useState("");
  const [descricaoNota, setDescricaoNota] = useState("");
  const [busca, setBusca] = useState("");
  const [animar, setAnimar] = useState(false);

  // ==========================
  // Carregar dados salvos
  // ==========================
  useEffect(() => {
    setAnimar(true);

    const f = JSON.parse(localStorage.getItem("registro_fotos") || "[]");
    const a = JSON.parse(localStorage.getItem("registro_anotacoes") || "[]");

    setFotos(f);
    setAnotacoes(a);
  }, []);

  const salvarFotos = (lista) => {
    setFotos(lista);
    localStorage.setItem("registro_fotos", JSON.stringify(lista));
  };

  const salvarNotas = (lista) => {
    setAnotacoes(lista);
    localStorage.setItem("registro_anotacoes", JSON.stringify(lista));
  };

  // ==========================
  // Upload: converter para Base64
  // ==========================
  const handleImagem = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = () => setImagemBase64(leitor.result);
    leitor.readAsDataURL(arquivo);
  };

  // ==========================
  // Salvar Foto
  // ==========================
  const salvarFoto = (e) => {
    e.preventDefault();

    if (!imagemBase64) {
      alert("Selecione uma imagem.");
      return;
    }

    const nova = {
      id: Date.now(),
      titulo: tituloFoto || "Sem título",
      imagem: imagemBase64,
    };

    salvarFotos([...fotos, nova]);

    setTituloFoto("");
    setImagemBase64("");
    setModalFoto(false);
  };

  // ==========================
  // Salvar Nota
  // ==========================
  const salvarNota = (e) => {
    e.preventDefault();

    if (!tituloNota || !descricaoNota) {
      alert("Preencha título e descrição.");
      return;
    }

    const nova = {
      id: Date.now(),
      titulo: tituloNota,
      descricao: descricaoNota,
    };

    salvarNotas([...anotacoes, nova]);

    setTituloNota("");
    setDescricaoNota("");
    setModalNota(false);
  };

  // ==========================
  // Excluir
  // ==========================
  const excluirFoto = (id) => {
    salvarFotos(fotos.filter((f) => f.id !== id));
  };

  const excluirNota = (id) => {
    salvarNotas(anotacoes.filter((a) => a.id !== id));
  };

  // ==========================
  // Buscar
  // ==========================
  const filtrar = (lista) => {
    if (!busca) return lista;
    const termo = busca.toLowerCase();
    return lista.filter(
      (i) =>
        i.titulo.toLowerCase().includes(termo) ||
        (i.descricao && i.descricao.toLowerCase().includes(termo))
    );
  };

  const fotosFiltradas = filtrar(fotos);
  const notasFiltradas = filtrar(anotacoes);

  return (
    <div className="registro-container">
      <div className={`registro-content animar-registro`}>
        <h1 className="registro-titulo">📚 Registro Técnico da Oficina Sabino</h1>

        {/* GRID DE CARDS */}
        <div className="registro-grid">
          {/* Foto */}
          <button className="registro-card" onClick={() => setModalFoto(true)}>
            <FaCamera className="icon-reg" />
            <p>Adicionar Foto</p>
          </button>

          {/* Nota */}
          <button className="registro-card" onClick={() => setModalNota(true)}>
            <FaBook className="icon-reg" />
            <p>Nova Anotação</p>
          </button>
        </div>

        {/* BUSCA */}
        <div className="registro-busca">
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar fotos ou anotações..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* =======================
            LISTA DE FOTOS
        ======================== */}
        <h2 className="registro-subtitulo">📸 Fotos</h2>

        {fotosFiltradas.length === 0 ? (
          <p className="registro-vazio">Nenhuma foto salva.</p>
        ) : (
          <div className="registro-fotos-lista">
            {fotosFiltradas.map((foto) => (
              <div key={foto.id} className="registro-foto-card">
                <img src={foto.imagem} alt={foto.titulo} />
                <p>{foto.titulo}</p>
                <button className="btn-delete" onClick={() => excluirFoto(foto.id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* =======================
            LISTA DE NOTAS
        ======================== */}
        <h2 className="registro-subtitulo">📝 Anotações</h2>

        {notasFiltradas.length === 0 ? (
          <p className="registro-vazio">Nenhuma anotação salva.</p>
        ) : (
          notasFiltradas.map((nota) => (
            <div key={nota.id} className="registro-nota-card">
              <div>
                <strong>{nota.titulo}</strong>
                <p>{nota.descricao}</p>
              </div>
              <button className="btn-delete" onClick={() => excluirNota(nota.id)}>
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      {/* =======================
          MODAL FOTO
      ======================== */}
      <Modal
        isOpen={modalFoto}
        onClose={() => setModalFoto(false)}
        title="Adicionar Foto"
      >
        <form className="registro-form" onSubmit={salvarFoto}>
          <label>Título (opcional):</label>
          <input
            type="text"
            value={tituloFoto}
            onChange={(e) => setTituloFoto(e.target.value)}
          />

          <label>Imagem:</label>
          <input type="file" accept="image/*" onChange={handleImagem} />

          <button className="btn-principal" type="submit">
            Salvar Foto
          </button>
        </form>
      </Modal>

      {/* =======================
          MODAL ANOTAÇÃO
      ======================== */}
      <Modal
        isOpen={modalNota}
        onClose={() => setModalNota(false)}
        title="Nova Anotação"
      >
        <form className="registro-form" onSubmit={salvarNota}>
          <label>Título:</label>
          <input
            type="text"
            value={tituloNota}
            onChange={(e) => setTituloNota(e.target.value)}
          />

          <label>Descrição:</label>
          <textarea
            value={descricaoNota}
            onChange={(e) => setDescricaoNota(e.target.value)}
          />

          <button className="btn-principal" type="submit">
            Salvar Anotação
          </button>
        </form>
      </Modal>
    </div>
  );
}
