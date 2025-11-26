import React, { useEffect, useState, useRef } from "react";
import "./Registro.css"; // ou Registro.css, se preferir renomear
import Modal from "../../components/Modal";
import { FaCameraRetro, FaFolderOpen } from "react-icons/fa";

export default function Registro() {
  // Lista de registros
  const [registros, setRegistros] = useState([]);

  // Campos do formulário
  const [titulo, setTitulo] = useState("");
  const [motor, setMotor] = useState("");
  const [medidas, setMedidas] = useState("");
  const [ponto, setPonto] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Imagem (foto)
  const [previewImagem, setPreviewImagem] = useState("");
  const [arquivoImagem, setArquivoImagem] = useState(null);

  // Busca nos registros salvos
  const [busca, setBusca] = useState("");

  // Modais
  const [modalNovoRegistro, setModalNovoRegistro] = useState(false);
  const [modalZoom, setModalZoom] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);

  // Referência da área de registros salvos (pra rolar até lá)
  const listaRef = useRef(null);

  // ============================
  // LocalStorage
  // ============================
  useEffect(() => {
    try {
      const armazenados = JSON.parse(
        localStorage.getItem("registrosTecnicos") || "[]"
      );
      setRegistros(armazenados);
    } catch (e) {
      console.error("Erro ao ler registros técnicos:", e);
      setRegistros([]);
    }
  }, []);

  const salvarRegistros = (lista) => {
    setRegistros(lista);
    localStorage.setItem("registrosTecnicos", JSON.stringify(lista));
  };

  // ============================
  // Upload de imagem
  // ============================
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArquivoImagem(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImagem(ev.target.result); // base64
    };
    reader.readAsDataURL(file);
  };

  // ============================
  // Cadastrar novo registro
  // ============================
  const cadastrarRegistro = (e) => {
    e.preventDefault();

    if (!titulo && !motor && !medidas && !ponto && !observacoes && !previewImagem) {
      alert("Preencha alguma informação ou envie uma foto para salvar o registro.");
      return;
    }

    const novoRegistro = {
      id: Date.now(),
      titulo: titulo || "Registro sem título",
      motor,
      medidas,
      ponto,
      observacoes,
      imagem: previewImagem || null,
      dataCriacao: new Date().toLocaleString("pt-BR"),
    };

    const lista = [novoRegistro, ...registros];
    salvarRegistros(lista);

    // Limpa formulário
    setTitulo("");
    setMotor("");
    setMedidas("");
    setPonto("");
    setObservacoes("");
    setArquivoImagem(null);
    setPreviewImagem("");
    setModalNovoRegistro(false);
  };

  // ============================
  // Busca
  // ============================
  const aplicarBusca = () => {
    if (!busca) return registros;
    const termo = busca.toLowerCase();
    return registros.filter(
      (r) =>
        r.titulo.toLowerCase().includes(termo) ||
        (r.motor && r.motor.toLowerCase().includes(termo)) ||
        (r.observacoes && r.observacoes.toLowerCase().includes(termo))
    );
  };

  const registrosFiltrados = aplicarBusca();

  // ============================
  // Zoom da imagem
  // ============================
  const abrirZoom = (registro) => {
    setRegistroSelecionado(registro);
    setModalZoom(true);
  };

  // ============================
  // Scroll para registros salvos
  // ============================
  const irParaRegistrosSalvos = () => {
    if (listaRef.current) {
      listaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ============================
  // JSX
  // ============================
  return (
    <div className="registro-container">
      <div className="registro-content page-transition-side">
        {/* Cabeçalho */}
        <header className="registro-header">
          <h1>📚 Registro Técnico da Oficina Sabino</h1>
          <p>Salve fotos, medidas, ponto de motor e observações importantes.</p>
        </header>

        {/* Cards principais */}
        <div className="registro-grid-cards">
          {/* Card novo registro */}
          <button
            className="registro-card registro-card--novo"
            onClick={() => setModalNovoRegistro(true)}
          >
            <div className="registro-card-icone">
              <FaCameraRetro />
            </div>
            <div className="registro-card-texto">
              <h2>Novo Registro</h2>
              <p>Adicionar foto, medidas e anotações de um motor.</p>
            </div>
          </button>

          {/* Card registros salvos */}
          <button
            className="registro-card registro-card--salvos"
            onClick={irParaRegistrosSalvos}
          >
            <div className="registro-card-icone">
              <FaFolderOpen />
            </div>
            <div className="registro-card-texto">
              <h2>Registros Salvos</h2>
              <p>Consultar rapidamente seus registros técnicos.</p>
            </div>
          </button>
        </div>

        {/* ============================
            LISTA DE REGISTROS SALVOS
        ============================ */}
        <section
          className="registro-lista-section"
          ref={listaRef}
        >
          <div className="registro-lista-header">
            <h2>📂 Registros Salvos</h2>
            <input
              type="text"
              placeholder="Buscar por título, motor ou observação..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {registrosFiltrados.length === 0 ? (
            <p className="texto-vazio-registro">
              Nenhum registro técnico salvo ainda.
            </p>
          ) : (
            <div className="registro-lista">
              {registrosFiltrados.map((r) => (
                <div
                  key={r.id}
                  className="registro-item-card"
                  onClick={() => abrirZoom(r)}
                >
                  <div className="registro-item-esquerda">
                    {r.imagem ? (
                      <img
                        src={r.imagem}
                        alt={r.titulo}
                        className="registro-thumb"
                      />
                    ) : (
                      <div className="registro-thumb sem-imagem">
                        <span>Sem foto</span>
                      </div>
                    )}
                  </div>
                  <div className="registro-item-direita">
                    <h3>{r.titulo}</h3>
                    {r.motor && <p><strong>Motor:</strong> {r.motor}</p>}
                    {r.medidas && (
                      <p className="registro-linha">
                        <strong>Medidas:</strong> {r.medidas}
                      </p>
                    )}
                    {r.ponto && (
                      <p className="registro-linha">
                        <strong>Ponto:</strong> {r.ponto}
                      </p>
                    )}
                    {r.observacoes && (
                      <p className="registro-linha">
                        <strong>Obs.:</strong> {r.observacoes}
                      </p>
                    )}
                    {r.dataCriacao && (
                      <p className="registro-data">
                        Salvo em {r.dataCriacao}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ============================
          MODAL NOVO REGISTRO
      ============================ */}
      <Modal
        isOpen={modalNovoRegistro}
        onClose={() => setModalNovoRegistro(false)}
        title="Novo Registro Técnico"
      >
        <form className="registro-form" onSubmit={cadastrarRegistro}>
          <label>Título (carro / projeto):</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label>Motor:</label>
          <input
            type="text"
            placeholder="Ex.: 2.0 8V, 1.6 16V..."
            value={motor}
            onChange={(e) => setMotor(e.target.value)}
          />

          <label>Medidas (folgas, torque, etc.):</label>
          <textarea
            value={medidas}
            onChange={(e) => setMedidas(e.target.value)}
          />

          <label>Ponto do motor:</label>
          <textarea
            value={ponto}
            onChange={(e) => setPonto(e.target.value)}
          />

          <label>Observações gerais:</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />

          <label>Foto (opcional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
          />

          {previewImagem && (
            <div className="preview-imagem-container">
              <p>Pré-visualização:</p>
              <img
                src={previewImagem}
                alt="Pré-visualização"
                className="preview-imagem"
              />
            </div>
          )}

          <button type="submit" className="btn-principal">
            Salvar Registro
          </button>
        </form>
      </Modal>

      {/* ============================
          MODAL ZOOM DA IMAGEM
      ============================ */}
      <Modal
        isOpen={modalZoom}
        onClose={() => setModalZoom(false)}
        title={registroSelecionado?.titulo || "Registro Técnico"}
      >
        {registroSelecionado && (
          <div className="registro-zoom-conteudo">
            {registroSelecionado.imagem && (
              <img
                src={registroSelecionado.imagem}
                alt={registroSelecionado.titulo}
                className="registro-zoom-imagem"
              />
            )}

            <div className="registro-zoom-textos">
              {registroSelecionado.motor && (
                <p><strong>Motor:</strong> {registroSelecionado.motor}</p>
              )}
              {registroSelecionado.medidas && (
                <p><strong>Medidas:</strong> {registroSelecionado.medidas}</p>
              )}
              {registroSelecionado.ponto && (
                <p><strong>Ponto:</strong> {registroSelecionado.ponto}</p>
              )}
              {registroSelecionado.observacoes && (
                <p><strong>Observações:</strong> {registroSelecionado.observacoes}</p>
              )}
              {registroSelecionado.dataCriacao && (
                <p className="registro-data">
                  Salvo em {registroSelecionado.dataCriacao}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
