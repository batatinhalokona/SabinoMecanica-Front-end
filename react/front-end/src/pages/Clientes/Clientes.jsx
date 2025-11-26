// src/pages/Clientes/Clientes.jsx

// Importa os hooks do React
import { useEffect, useState } from "react";

// Importa a instância do axios configurada
import api from "../../api/api";

// (opcional) CSS específico da tela de clientes
import "./Clientes.css";

// Componente principal da página de Clientes
export default function Clientes() {
  // -----------------------------
  // ESTADOS
  // -----------------------------

  // Guarda a lista de clientes vindos do back-end
  const [clientes, setClientes] = useState([]);

  // Guarda os dados do formulário (usado tanto para cadastrar quanto editar)
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    telefone: "",
    situacao: "",
  });

  // Guarda o ID do cliente que está sendo editado
  // Se for null → estamos cadastrando um novo
  // Se tiver um id → estamos editando
  const [editId, setEditId] = useState(null);

  // -----------------------------
  // CARREGAR CLIENTES AO ABRIR TELA
  // -----------------------------
  useEffect(() => {
    carregarClientes();
  }, []);

  // Função que busca os clientes no back-end
  async function carregarClientes() {
    try {
      // GET na rota de clientes do back (ajusta se sua rota for diferente)
      const response = await api.get("/api/cliente");
      // salva lista no estado
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  // -----------------------------
  // ATUALIZAÇÃO DO FORMULÁRIO
  // -----------------------------
  function handleChange(e) {
    // pega o nome do campo (name="...") e o valor digitado
    const { name, value } = e.target;

    // atualiza somente o campo que mudou, mantendo o resto
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // -----------------------------
  // SUBMIT DO FORMULÁRIO (CRIAR / EDITAR)
  // -----------------------------
  async function handleSubmit(e) {
    // evita reload padrão do formulário
    e.preventDefault();

    try {
      if (editId) {
        // Se tem editId → é edição → PUT /api/cliente/{id}
        await api.put(`/api/cliente/${editId}`, formData);
      } else {
        // Se não tem editId → é novo cliente → POST /api/cliente
        await api.post("/api/cliente", formData);
      }

      // Recarrega a lista de clientes após salvar
      await carregarClientes();

      // Limpa o formulário para o próximo cadastro/edição
      setFormData({
        cpf: "",
        nome: "",
        telefone: "",
        situacao: "",
      });

      // Sai do modo edição
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  }

  // -----------------------------
  // CLICAR NO BOTÃO EDITAR
  // -----------------------------
  function handleEdit(cliente) {
    // Preenche o form com os dados do cliente clicado
    setFormData({
      cpf: cliente.cpf || "",
      nome: cliente.nome || "",
      telefone: cliente.telefone || "",
      situacao: cliente.situacao || "",
    });

    // Guarda o id para o PUT na hora de salvar
    setEditId(cliente.id);
  }

  // -----------------------------
  // EXCLUIR CLIENTE
  // -----------------------------
  async function handleDelete(id) {
    // Confirma antes de apagar
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      // DELETE /api/cliente/{id}
      await api.delete(`/api/cliente/${id}`);

      // Atualiza a lista
      await carregarClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  }

  // -----------------------------
  // RENDERIZAÇÃO
  // -----------------------------
  return (
    <div className="cliente-page">
      <h1>Clientes</h1>

      {/* FORMULÁRIO DE CLIENTE */}
      <form onSubmit={handleSubmit} className="form-cliente">
        <div>
          <label>CPF:</label>
          <input
            type="text"
            name="cpf"               // precisa bater com a propriedade do back
            value={formData.cpf}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Telefone:</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Situação:</label>
          <input
            type="text"
            name="situacao"
            value={formData.situacao}
            onChange={handleChange}
            placeholder="Ex: Ativo, Inadimplente, Bloqueado..."
          />
        </div>

        <button type="submit">
          {editId ? "Atualizar Cliente" : "Cadastrar Cliente"}
        </button>
      </form>

      {/* TABELA DE CLIENTES */}
      <table className="tabela-cliente">
        <thead>
          <tr>
            <th>CPF</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Situação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.cpf}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.situacao}</td>
              <td>
                {/* BOTÃO EDITAR: carrega dados no formulário */}
                <button type="button" onClick={() => handleEdit(cliente)}>
                  Editar
                </button>

                {/* BOTÃO EXCLUIR: apaga do back */}
                <button type="button" onClick={() => handleDelete(cliente.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
