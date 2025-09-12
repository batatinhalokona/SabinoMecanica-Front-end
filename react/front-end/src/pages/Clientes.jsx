// Importa os hooks e o axios
import { useState, useEffect } from "react";
import axios from "axios";
import "./Pages.css"; // Estilo global para formulários e tabelas

// Componente de Clientes
export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/clientes");
      setClientes(resposta.data);
    } catch (err) {
      setErro("Erro ao buscar clientes");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvarCliente = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/clientes/${editandoId}`, form);
      } else {
        await axios.post("http://localhost:3001/clientes", form);
      }
      setForm({ nome: "", telefone: "", cpf: "" });
      setEditandoId(null);
      buscarClientes();
    } catch (err) {
      setErro("Erro ao salvar cliente");
      console.error(err);
    }
  };

  const handleEditar = (cliente) => {
    setForm(cliente);
    setEditandoId(cliente.id);
  };

  // Função com confirmação antes de excluir
  const excluirCliente = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3001/clientes/${id}`);
      buscarClientes();
    } catch (err) {
      setErro("Erro ao excluir cliente");
      console.error(err);
    }
  };

  const cancelarEdicao = () => {
    setForm({ nome: "", telefone: "", cpf: "" });
    setEditandoId(null);
  };

  return (
    <div className="page-container">
      <h2>Clientes da Oficina</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {/* Formulário */}
      <form className="page-form" onSubmit={salvarCliente}>
        <input
          type="text"
          name="nome"
          placeholder="Nome do Cliente"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          onChange={handleChange}
          required
        />

        <button type="submit">{editandoId ? "Atualizar" : "Cadastrar"}</button>
        {editandoId && <button type="button" onClick={cancelarEdicao}>Cancelar</button>}
      </form>

      {/* Tabela de clientes */}
      {clientes.length === 0 ? (
        <p>Nenhum cliente cadastrado.</p>
      ) : (
        <table className="page-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.telefone}</td>
                <td>{c.cpf}</td>
                <td>
                  <button onClick={() => handleEditar(c)} style={{ marginRight: "10px" }}>Editar</button>
                  <button onClick={() => excluirCliente(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
