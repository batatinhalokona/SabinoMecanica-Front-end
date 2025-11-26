import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Servicos() {
  // lista de serviços
  const [servicos, setServicos] = useState([]);
  // listas de clientes e carros
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [carrosFiltrados, setCarrosFiltrados] = useState([]);

  // form
  const [formData, setFormData] = useState({
    data_ini: "",
    data_fim: "",
    data_garantia: "",
    descricao: "",
    preco_peca_pago: 0,
    preco_peca_cobrado: 0,
    preco_mao_obra: 0,
    valor_total: 0,
    status: "",
    clienteId: "", // novo
    carroId: "", // novo
  });

  const [editId, setEditId] = useState(null);

  // carrega tudo ao abrir
  useEffect(() => {
    carregarClientes();
    carregarCarros();
    carregarServicos();
  }, []);

  async function carregarClientes() {
    try {
      const response = await api.get("/api/cliente");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  async function carregarCarros() {
    try {
      const response = await api.get("/api/carro");
      setCarros(response.data);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    }
  }

  async function carregarServicos() {
    try {
      const response = await api.get("/api/servico");
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  }

  // quando muda qualquer campo do form
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => {
      let novo = { ...prev, [name]: value };

      // se mudou cliente, precisa filtrar carros desse cliente
      if (name === "clienteId") {
        novo.carroId = ""; // limpa carro escolhido
        const filtrados = carros.filter((carro) => carro.clienteId === value);
        setCarrosFiltrados(filtrados);
      }

      // garante que os campos numéricos são números
      if (
        name === "preco_peca_pago" ||
        name === "preco_peca_cobrado" ||
        name === "preco_mao_obra"
      ) {
        novo[name] = parseFloat(value) || 0;
      }

      // recálculo do valor total
      novo.valor_total =
        (parseFloat(novo.preco_peca_cobrado) || 0) +
        (parseFloat(novo.preco_mao_obra) || 0);

      return novo;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/api/servico/${editId}`, formData);
      } else {
        await api.post("/api/servico", formData);
      }

      await carregarServicos();

      setFormData({
        data_ini: "",
        data_fim: "",
        data_garantia: "",
        descricao: "",
        preco_peca_pago: 0,
        preco_peca_cobrado: 0,
        preco_mao_obra: 0,
        valor_total: 0,
        status: "",
        clienteId: "",
        carroId: "",
      });
      setCarrosFiltrados([]);
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    }
  }

  function handleEdit(servico) {
    setFormData({
      data_ini: servico.data_ini || "",
      data_fim: servico.data_fim || "",
      data_garantia: servico.data_garantia || "",
      descricao: servico.descricao || "",
      preco_peca_pago: servico.preco_peca_pago || 0,
      preco_peca_cobrado: servico.preco_peca_cobrado || 0,
      preco_mao_obra: servico.preco_mao_obra || 0,
      valor_total: servico.valor_total || 0,
      status: servico.status || "",
      clienteId: servico.clienteId || "",
      carroId: servico.carroId || "",
    });

    // ajusta carros filtrados de acordo com o cliente desse serviço
    const filtrados = carros.filter(
      (carro) => carro.clienteId === servico.clienteId
    );
    setCarrosFiltrados(filtrados);

    setEditId(servico.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await api.delete(`/api/servico/${id}`);
      await carregarServicos();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    }
  }

  function getNomeCliente(clienteId) {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }

  function getDescricaoCarro(carroId) {
    const carro = carros.find((c) => c.id === carroId);
    if (!carro) return "Carro não encontrado";
    return `${carro.modelo} - ${carro.placa}`;
  }

  return (
    <div className="servico-page">
      <h1>Serviços</h1>

      <form onSubmit={handleSubmit} className="form-servico">
        {/* CLIENTE */}
        <div>
          <label>Cliente:</label>
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

        {/* CARRO DO CLIENTE */}
        <div>
          <label>Carro:</label>
          <select
            name="carroId"
            value={formData.carroId}
            onChange={handleChange}
            disabled={!formData.clienteId}
          >
            <option value="">
              {formData.clienteId
                ? "Selecione um carro"
                : "Selecione um cliente primeiro"}
            </option>
            {carrosFiltrados.map((carro) => (
              <option key={carro.id} value={carro.id}>
                {carro.modelo} - {carro.placa}
              </option>
            ))}
          </select>
        </div>

        {/* DEMAIS CAMPOS IGUAIS AO QUE JÁ TINHA */}
        <div>
          <label>Data Início:</label>
          <input
            type="date"
            name="data_ini"
            value={formData.data_ini}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Data Fim:</label>
          <input
            type="date"
            name="data_fim"
            value={formData.data_fim}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Data Garantia:</label>
          <input
            type="date"
            name="data_garantia"
            value={formData.data_garantia}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Preço Peça (Pago):</label>
          <input
            type="number"
            step="0.01"
            name="preco_peca_pago"
            value={formData.preco_peca_pago}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Preço Peça (Cobrado):</label>
          <input
            type="number"
            step="0.01"
            name="preco_peca_cobrado"
            value={formData.preco_peca_cobrado}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Preço Mão de Obra:</label>
          <input
            type="number"
            step="0.01"
            name="preco_mao_obra"
            value={formData.preco_mao_obra}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Valor Total:</label>
          <input
            type="number"
            step="0.01"
            name="valor_total"
            value={formData.valor_total}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Ex: Em andamento, Concluído..."
          />
        </div>

        <button type="submit">
          {editId ? "Atualizar Serviço" : "Cadastrar Serviço"}
        </button>
      </form>

      {/* LISTA DE SERVIÇOS */}
      <table className="tabela-servico">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Carro</th>
            <th>Descrição</th>
            <th>Peça (Cobrado)</th>
            <th>Mão de Obra</th>
            <th>Valor Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((servico) => (
            <tr key={servico.id}>
              <td>{getNomeCliente(servico.clienteId)}</td>
              <td>{getDescricaoCarro(servico.carroId)}</td>
              <td>{servico.descricao}</td>
              <td>{servico.preco_peca_cobrado}</td>
              <td>{servico.preco_mao_obra}</td>
              <td>{servico.valor_total}</td>
              <td>{servico.status}</td>
              <td>
                <button onClick={() => handleEdit(servico)}>Editar</button>
                <button onClick={() => handleDelete(servico.id)}>
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
