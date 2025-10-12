// Importações necessárias
import { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css";
import api from "../api/api";



// Componente de Serviços
export default function Servicos() {
  const response = await api.post("/login", { email, senha });

  // Estados para armazenar os serviços e possíveis mensagens de erro
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState("");

  // Estados para controlar o formulário
  const [form, setForm] = useState({
    cliente: "",
    servico: "",
    descricao: "",
    valor: "",
    data: "",
  });

  const [editandoId, setEditandoId] = useState(null); // Controla se estamos editando

  // Ao carregar a tela, busca os serviços
  useEffect(() => {
    buscarServicos();
  }, []);

  // Função para buscar todos os serviços do JSON Server
  const buscarServicos = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/servicos");
      setServicos(resposta.data);
    } catch (err) {
      setErro("Erro ao buscar serviços");
      console.error(err);
    }
  };

  // Atualiza o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Salva um novo serviço ou atualiza um existente
  const salvarServico = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        // Editar serviço existente
        await axios.put(`http://localhost:3001/servicos/${editandoId}`, form);
      } else {
        // Criar novo serviço
        await axios.post("http://localhost:3001/servicos", form);
      }
      setForm({ cliente: "", servico: "", descricao: "", valor: "", data: "" });
      setEditandoId(null);
      buscarServicos();
    } catch (err) {
      setErro("Erro ao salvar serviço");
      console.error(err);
    }
  };

  // Preenche o formulário para editar um serviço
  const handleEditar = (servico) => {
    setForm(servico);
    setEditandoId(servico.id);
  };

  // Exclui um serviço
  const excluirServico = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/servicos/${id}`);
      buscarServicos();
    } catch (err) {
      setErro("Erro ao excluir serviço");
      console.error(err);
    }
  };

  // Cancela a edição
  const cancelarEdicao = () => {
    setForm({ cliente: "", servico: "", descricao: "", valor: "", data: "" });
    setEditandoId(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Serviços da Oficina</h2>

      {/* Exibe erros se houver */}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {/* Formulário de cadastro/edição */}
      <form className="page-form" onSubmit={salvarServico}>


        <input
          type="text"
          name="cliente"
          placeholder="Nome do Cliente"
          value={form.cliente}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="servico"
          placeholder="Serviço Realizado"
          value={form.servico}
          onChange={handleChange}
          required
        />

        <textarea
          name="descricao"
          placeholder="Descrição do Serviço"
          value={form.descricao}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="valor"
          placeholder="Valor (R$)"
          value={form.valor}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="data"
          value={form.data}
          onChange={handleChange}
          required
        />

        <button type="submit">{editandoId ? "Atualizar" : "Cadastrar"}</button>
        {editandoId && <button type="button" onClick={cancelarEdicao}>Cancelar</button>}
      </form>

      <hr style={{ margin: "2rem 0" }} />

      {/* Lista de serviços em formato de cards */}
      {servicos.length === 0 ? (
        <p>Nenhum serviço cadastrado.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {servicos.map((s) => (
            <div key={s.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "6px", width: "300px" }}>
              <p><strong>Cliente:</strong> {s.cliente}</p>
              <p><strong>Serviço:</strong> {s.servico}</p>
              <p><strong>Descrição:</strong> {s.descricao}</p>
              <p><strong>Valor:</strong> R$ {s.valor}</p>
              <p><strong>Data:</strong> {s.data}</p>
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleEditar(s)} style={{ marginRight: "10px" }}>Editar</button>
                <button onClick={() => excluirServico(s.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
