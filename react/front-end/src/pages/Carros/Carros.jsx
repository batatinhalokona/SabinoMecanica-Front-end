import { useEffect, useState } from "react";
import api from "../../api/api"; // caminho correto


export default function Carros() {
  const [carros, setCarros] = useState([]);
  const [clientes, setClientes] = useState([]);

  // usamos clienteId só pra controlar o select no front
  const [formData, setFormData] = useState({
    modelo: "",
    placa: "",
    url_foto: "",
    clienteId: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    carregarClientes();
    carregarCarros();
  }, []);

  async function carregarClientes() {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  async function carregarCarros() {
    try {
      // AJUSTA AQUI pro path do teu controller:
      // se for @RequestMapping("/carros") → "/carros"
      // se for "/api/carro" → troca aqui também
      const response = await api.get("/carros");
      setCarros(response.data);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // monta o JSON exatamente como o back espera
    const payload = {
      modelo: formData.modelo,
      placa: formData.placa,
      url_foto: formData.url_foto,
      cliente: {
        id: formData.clienteId, // vai virar a FK id_cliente no banco
      },
    };

    try {
      if (editId) {
        await api.put(`/carros/${editId}`, payload);
      } else {
        await api.post("/carros", payload);
      }

      await carregarCarros();

      setFormData({
        modelo: "",
        placa: "",
        url_foto: "",
        clienteId: "",
      });
      setEditId(null);
    } catch (error) {
      console.error(
        "Erro ao salvar carro:",
        error.response?.data || error.message
      );
    }
  }

  function handleEdit(carro) {
    setFormData({
      modelo: carro.modelo || "",
      placa: carro.placa || "",
      url_foto: carro.url_foto || "",
      // agora o cliente vem aninhado: carro.cliente.id
      clienteId: carro.cliente?.id || "",
    });
    setEditId(carro.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este carro?")) return;

    try {
      await api.delete(`/carros/${id}`);
      await carregarCarros();
    } catch (error) {
      console.error("Erro ao excluir carro:", error);
    }
  }

  function getNomeClienteDoCarro(carro) {
    return carro.cliente ? carro.cliente.nome : "Sem cliente";
  }

  return (
    <div className="carro-page">
      <h1>Carros</h1>

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
              <td>{getNomeClienteDoCarro(carro)}</td>
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
