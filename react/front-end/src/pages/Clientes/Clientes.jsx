// src/pages/Cliente.jsx

import { useEffect, useState } from "react";    // hooks do React
import api from "../../api/api";                  // seu axios configurado (baseURL)

export default function Clientes() {
  // estado com a lista de clientes vindos do back
  const [clientes, setClientes] = useState([]);

  // estado com os dados do formulário
  const [formData, setFormData] = useState({
    cpf: "",        // mesmo nome do campo no back
    nome: "",
    telefone: "",
    situacao: "",
  });

  // estado para saber se estamos editando (id do cliente)
  const [editId, setEditId] = useState(null);

  // carrega clientes na primeira vez que o componente renderiza
  useEffect(() => {
    carregarClientes();
  }, []);

  // função que busca os clientes no back-end
  async function carregarClientes() {
    try {
      const response = await api.get("/api/cliente"); // ajuste pro seu endpoint
      setClientes(response.data);                     // salva no estado
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  // atualiza o form quando o usuário digita
  function handleChange(e) {
    const { name, value } = e.target;   // pega o nome e o valor do input
    setFormData((prev) => ({
      ...prev,                          // mantém o que já tinha
      [name]: value,                    // atualiza só o campo alterado
    }));
  }

  // envia o formulário (criar ou editar)
  async function handleSubmit(e) {
    e.preventDefault();                 // evita reload da página

    try {
      if (editId) {
        // se tiver editId, é edição (PUT)
        await api.put(`/api/cliente/${editId}`, formData);
      } else {
        // se não tiver, é criação (POST)
        await api.post("/api/cliente", formData);
      }

      // depois de salvar, recarrega a lista
      await carregarClientes();

      // limpa o formulário
      setFormData({
        cpf: "",
        nome: "",
        telefone: "",
        situacao: "",
      });
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  }

  // quando clicar em "Editar" em algum cliente da lista
  function handleEdit(cliente) {
    setFormData({
      cpf: cliente.cpf,
      nome: cliente.nome,
      telefone: cliente.telefone,
      situacao: cliente.situacao,
    });
    setEditId(cliente.id);    // guarda o id pra usar no PUT
  }

  // excluir cliente
  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await api.delete(`/api/cliente/${id}`);
      await carregarClientes();    // recarrega a lista
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  }

  return (
    <div className="cliente-page">
      <h1>Clientes</h1>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="form-cliente">
        <div>
          <label>CPF:</label>
          <input
            type="text"
            name="cpf"               // TEM QUE SER "cpf"
            value={formData.cpf}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"              // TEM QUE SER "nome"
            value={formData.nome}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Telefone:</label>
          <input
            type="text"
            name="telefone"          // TEM QUE SER "telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Situação:</label>
          <input
            type="text"
            name="situacao"          // TEM QUE SER "situacao"
            value={formData.situacao}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editId ? "Atualizar Cliente" : "Cadastrar Cliente"}
        </button>
      </form>

      {/* LISTA DE CLIENTES */}
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
                <button onClick={() => handleEdit(cliente)}>Editar</button>
                <button onClick={() => handleDelete(cliente.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
