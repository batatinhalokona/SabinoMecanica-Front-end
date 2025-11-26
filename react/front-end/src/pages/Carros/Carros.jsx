import { useEffect, useState } from "react";
import api from "../../api/api"; // caminho correto

export default function Carros() {
  // lista de carros
  const [carros, setCarros] = useState([]);
  // lista de clientes pra escolher o dono do carro
  const [clientes, setClientes] = useState([]);

  // dados do formulário
  const [formData, setFormData] = useState({
    modelo: "",
    placa: "",
    url_foto: "",
    clienteId: "", // id do cliente dono do carro
  });

  // id do carro que está sendo editado (se estiver editando)
  const [editId, setEditId] = useState(null);

  // carrega clientes e carros ao abrir a tela
  useEffect(() => {
    carregarClientes();
    carregarCarros();
  }, []);

  // busca clientes no back-end
  async function carregarClientes() {
    try {
      const response = await api.get("/api/cliente");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  // busca carros no back-end
  async function carregarCarros() {
    try {
      const response = await api.get("/api/carro");
      setCarros(response.data);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    }
  }

  // atualiza o formulário quando digita / seleciona algo
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // salvar (criar ou atualizar) carro
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/api/carro/${editId}`, formData);
      } else {
        await api.post("/api/carro", formData);
      }

      await carregarCarros();

      // limpa form
      setFormData({
        modelo: "",
        placa: "",
        url_foto: "",
        clienteId: "",
      });
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar carro:", error);
    }
  }

  // carregar dados para edição
  function handleEdit(carro) {
    setFormData({
      modelo: carro.modelo || "",
      placa: carro.placa || "",
      url_foto: carro.url_foto || "",
      // aqui assumo que vem carro.clienteId no JSON
      clienteId: carro.clienteId || "",
    });
    setEditId(carro.id);
  }

  // excluir carro
  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este carro?")) return;

    try {
      await api.delete(`/api/carro/${id}`);
      await carregarCarros();
    } catch (error) {
      console.error("Erro ao excluir carro:", error);
    }
  }

  // função auxiliar pra mostrar nome do cliente na tabela
  function getNomeCliente(clienteId) {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nome : "Sem cliente";
  }

  return (
    <div className="carro-page">
      <h1>Carros</h1>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="form-carro">
        <div>
          <label>Modelo:</label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Placa:</label>
          <input
            type="text"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>URL da Foto:</label>
          <input
            type="text"
            name="url_foto"
            value={formData.url_foto}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div>
          <label>Cliente (dono do carro):</label>
          <select
            name="clienteId"
            value={formData.clienteId}
            onChange={handleChange}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} - {cliente.cpf}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">
          {editId ? "Atualizar Carro" : "Cadastrar Carro"}
        </button>
      </form>

      {/* LISTA */}
      <table className="tabela-carro">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Cliente</th>
            <th>Foto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carros.map((carro) => (
            <tr key={carro.id}>
              <td>{carro.modelo}</td>
              <td>{carro.placa}</td>
              <td>{getNomeCliente(carro.clienteId)}</td>
              <td>
                {carro.url_foto ? (
                  <img
                    src={carro.url_foto}
                    alt={carro.modelo}
                    style={{ width: "80px", height: "auto" }}
                  />
                ) : (
                  "Sem foto"
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(carro)}>Editar</button>
                <button onClick={() => handleDelete(carro.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
