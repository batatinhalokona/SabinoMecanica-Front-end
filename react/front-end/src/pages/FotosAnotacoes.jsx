// Importa os hooks e o axios
import { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";


// Componente Fotos e Anotações
export default function FotosAnotacoes() {
  // Estado para armazenar a lista de fotos/anotações
  const [registros, setRegistros] = useState([]);

  // Estado para mensagens de erro
  const [erro, setErro] = useState("");

  // Estado para o formulário
  const [form, setForm] = useState({
    descricao: "",
    imagemUrl: "",
  });

  const [editandoId, setEditandoId] = useState(null); // Controla se estamos editando

  // Ao carregar a tela, busca os registros
  useEffect(() => {
    buscarRegistros();
  }, []);

  // Função para buscar registros no JSON Server
  const buscarRegistros = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/fotosAnotacoes");
      setRegistros(resposta.data);
    } catch (err) {
      setErro("Erro ao buscar registros");
      console.error(err);
    }
  };

  // Atualiza o estado do formulário
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Salva um novo registro ou atualiza um existente
  const salvarRegistro = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        // Atualizar
        await axios.put(`http://localhost:3001/fotosAnotacoes/${editandoId}`, form);
      } else {
        // Cadastrar novo
        await axios.post("http://localhost:3001/fotosAnotacoes", form);
      }
      setForm({ descricao: "", imagemUrl: "" });
      setEditandoId(null);
      buscarRegistros();
    } catch (err) {
      setErro("Erro ao salvar registro");
      console.error(err);
    }
  };

  // Preenche o formulário para edição
  const handleEditar = (registro) => {
    setForm(registro);
    setEditandoId(registro.id);
  };

  // Exclui um registro
  const excluirRegistro = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/fotosAnotacoes/${id}`);
      buscarRegistros();
    } catch (err) {
      setErro("Erro ao excluir registro");
      console.error(err);
    }
  };

  // Cancela a edição
  const cancelarEdicao = () => {
    setForm({ descricao: "", imagemUrl: "" });
    setEditandoId(null);
  };

  return (
    <div className="page-card">

      <h2>Fotos e Anotações da Oficina</h2>

      {/* Exibe erro se houver */}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {/* Formulário de cadastro/edição */}
      <form onSubmit={salvarRegistro} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
        <textarea
          name="descricao"
          placeholder="Anotação / Observação"
          value={form.descricao}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="imagemUrl"
          placeholder="URL da Imagem"
          value={form.imagemUrl}
          onChange={handleChange}
          required
        />

        <button type="submit">{editandoId ? "Atualizar" : "Cadastrar"}</button>
        {editandoId && <button type="button" onClick={cancelarEdicao}>Cancelar</button>}
      </form>

      <hr style={{ margin: "2rem 0" }} />

      {/* Lista de registros (fotos + anotações) */}
      {registros.length === 0 ? (
        <p>Nenhum registro encontrado.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {registros.map((r) => (
            <div key={r.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "6px", width: "300px" }}>
              <p><strong>Anotação:</strong> {r.descricao}</p>
              {r.imagemUrl && (
                <img src={r.imagemUrl} alt="Imagem" style={{ width: "100%", marginTop: "10px" }} />
              )}
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleEditar(r)} style={{ marginRight: "10px" }}>Editar</button>
                <button onClick={() => excluirRegistro(r.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
