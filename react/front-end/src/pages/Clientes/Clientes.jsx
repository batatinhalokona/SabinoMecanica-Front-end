// src/pages/Clientes/Clientes.jsx

import { useEffect, useState } from "react";
import api from "../../api/api";
import "./Clientes.css"; // opcional se quiser estilizar depois

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    telefone: "",
    situacao: "",
  });

  // ==== CARREGAR CLIENTES AO ABRIR ====
  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes"); // LISTAR
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  // ==== ATUALIZA INPUTS ====
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ==== CADASTRAR / EDITAR ====
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/clientes/${editId}`, formData); // EDITAR
      } else {
        await api.post("/clientes", formData); // CADASTRAR
      }

      carregarClientes(); // recarrega a tabela
      resetForm(); // limpa campos após salvar
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    }
  }

  // ==== EDITAR CLIQUE ====
  function handleEdit(cliente) {
    setFormData({
      cpf: cliente.cpf || "",
      nome: cliente.nome || "",
      telefone: cliente.telefone || "",
      situacao: cliente.situacao || "",
    });
    setEditId(cliente.id);
  }

  // ==== EXCLUIR ====
  async function handleDelete(id) {
    if (!window.confirm("Excluir cliente?")) return;

    try {
      await api.delete(`/clientes/${id}`);
      carregarClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  }

  // ==== RESET ====
  function resetForm() {
    setFormData({
      cpf: "",
      nome: "",
      telefone: "",
      situacao: "",
    });
    setEditId(null);
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
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome completo"
          />
        </div>

        <div>
          <label>Telefone:</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label>Situação:</label>
          <input
            type="text"
            name="situacao"
            value={formData.situacao}
            onChange={handleChange}
            placeholder="Ativo, Inativo, Inadimplente..."
          />
        </div>

        <button type="submit">
          {editId ? "Atualizar Cliente" : "Cadastrar Cliente"}
        </button>
      </form>

      {/* TABELA */}
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
                <button onClick={() => handleDelete(cliente.id)}>
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
