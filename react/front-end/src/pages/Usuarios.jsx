import { useEffect, useState } from "react";
import axios from "axios";

export default function Servicos() {
  // Pegando o usuário logado no localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    valor: "",
    duracao: "",
    categoria: "",
    clienteId: usuario?.tipo === "cliente" ? usuario.id : "", // Se for cliente, salva o ID
  });

  // Buscar os serviços do backend (JSON Server ou API)
  useEffect(() => {
    buscarServicos();
  }, []);

  const buscarServicos = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/servicos");

      // Se o usuário for cliente, filtra apenas os dele
      const dadosFiltrados =
        usuario?.tipo === "cliente"
          ? resposta.data.filter((s) => s.clienteId === usuario.id)
          : resposta.data;

      setServicos(dadosFiltrados);
    } catch (err) {
      setErro("Erro ao buscar serviços");
      console.error(err);
    }
  };

  const excluirServico = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/servicos/${id}`);
      buscarServicos();
    } catch (err) {
      setErro("Erro ao excluir serviço");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditar = (servico) => {
    setForm(servico);
    setEditandoId(servico.id);
  };

  const cancelarEdicao = () => {
    setForm({
      nome: "",
      descricao: "",
      valor: "",
      duracao: "",
      categoria: "",
      clienteId: usuario?.tipo === "cliente" ? usuario.id : "",
    });
    setEditandoId(null);
  };

  const salvarServico = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/servicos/${editandoId}`, form);
      } else {
        await axios.post("http://localhost:3001/servicos", form);
      }
      cancelarEdicao();
      buscarServicos();
    } catch (err) {
      setErro("Erro ao salvar serviço");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Serviços</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {/* Só mostra o formulário para gerentes */}
      {usuario?.tipo === "gerente" && (
        <>
          <h3>{editandoId ? "Editar Serviço" : "Cadastrar Novo Serviço"}</h3>
          <form onSubmit={salvarServico}>
            <input
              type="text"
              name="nome"
              placeholder="Nome do serviço"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
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
              type="text"
              name="duracao"
              placeholder="Duração"
              value={form.duracao}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="categoria"
              placeholder="Categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            />
            <button type="submit">
              {editandoId ? "Atualizar" : "Cadastrar"}
            </button>
            {editandoId && (
              <button type="button" onClick={cancelarEdicao}>
                Cancelar
              </button>
            )}
          </form>
          <hr />
        </>
      )}

      {servicos.length === 0 ? (
        <p>Nenhum serviço disponível.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Duração</th>
              <th>Categoria</th>
              {/* Ações só aparecem para gerente */}
              {usuario?.tipo === "gerente" && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {servicos.map((s) => (
              <tr key={s.id}>
                <td>{s.nome}</td>
                <td>{s.descricao}</td>
                <td>R$ {s.valor}</td>
                <td>{s.duracao}</td>
                <td>{s.categoria}</td>
                {usuario?.tipo === "gerente" && (
                  <td>
                    <button onClick={() => handleEditar(s)}>Editar</button>
                    <button onClick={() => excluirServico(s.id)}>
                      Excluir
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
