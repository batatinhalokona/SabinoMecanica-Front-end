// src/pages/Servicos/Servicos.jsx

import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Servicos() {
  // listas vindas do back
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [carrosFiltrados, setCarrosFiltrados] = useState([]);

  // form
  const [formData, setFormData] = useState({
    descricao: "",
    preco_peca_pago: 0,
    preco_peca_cobrado: 0,
    preco_mao_obra: 0,
    valor_total: 0,
    status: "",
    data_ini: "",
    data_fim: "",
    data_garantia: "",
    clienteId: "",
    carroId: "",
  });

  const [editId, setEditId] = useState(null);

  // carrega tudo quando a tela abre
  useEffect(() => {
    carregarClientes();
    carregarCarros();
    carregarServicos();
  }, []);

  async function carregarClientes() {
    try {
      const res = await api.get("/cliente"); // AJUSTA se teu controller for /clientes
      setClientes(res.data);
    } catch (e) {
      console.error("Erro ao buscar clientes:", e);
    }
  }

  async function carregarCarros() {
    try {
      const res = await api.get("/carros"); // AJUSTA se teu controller for /carro
      setCarros(res.data);
    } catch (e) {
      console.error("Erro ao buscar carros:", e);
    }
  }

  async function carregarServicos() {
    try {
      const res = await api.get("/servico"); // ou /servicos
      setServicos(res.data);
    } catch (e) {
      console.error("Erro ao buscar serviços:", e);
    }
  }

  // quando o usuário mexe em algum campo
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => {
      let novo = { ...prev, [name]: value };

      // se mudou o cliente → filtra carros daquele cliente
      if (name === "clienteId") {
        novo.carroId = "";
        const filtrados = carros.filter(
          (c) => c.cliente && c.cliente.id === value
        );
        setCarrosFiltrados(filtrados);
      }

      // campos numéricos
      if (
        name === "preco_peca_pago" ||
        name === "preco_peca_cobrado" ||
        name === "preco_mao_obra"
      ) {
        novo[name] = parseFloat(value) || 0;
      }

      // recalcula valor_total = peça cobrada + mão de obra
      novo.valor_total =
        (parseFloat(novo.preco_peca_cobrado) || 0) +
        (parseFloat(novo.preco_mao_obra) || 0);

      return novo;
    });
  }

  // salvar serviço (criar / editar)
  async function handleSubmit(e) {
    e.preventDefault();

    // monta o payload do jeitinho que o back espera
    const payload = {
      descricao: formData.descricao,
      preco_peca_pago: formData.preco_peca_pago,
      preco_peca_cobrado: formData.preco_peca_cobrado,
      preco_mao_obra: formData.preco_mao_obra,
      valor_total: formData.valor_total,
      status: formData.status,
      data_ini: formData.data_ini,
      data_fim: formData.data_fim,
      data_garantia: formData.data_garantia,
      carro: { id: formData.carroId },
      cliente: { id: formData.clienteId },
    };

    try {
      if (editId) {
        await api.put(`/servico/${editId}`, payload); // ou /servicos/${editId}
      } else {
        await api.post("/servico", payload); // ou /servicos
      }

      await carregarServicos();
      resetForm();
    } catch (error) {
      console.error(
        "Erro ao salvar serviço:",
        error.response?.data || error.message
      );
    }
  }

  function resetForm() {
    setFormData({
      descricao: "",
      preco_peca_pago: 0,
      preco_peca_cobrado: 0,
      preco_mao_obra: 0,
      valor_total: 0,
      status: "",
      data_ini: "",
      data_fim: "",
      data_garantia: "",
      clienteId: "",
      carroId: "",
    });
    setEditId(null);
    setCarrosFiltrados([]);
  }

  // quando clica em editar
  function handleEdit(servico) {
    setFormData({
      descricao: servico.descricao || "",
      preco_peca_pago: servico.preco_peca_pago || 0,
      preco_peca_cobrado: servico.preco_peca_cobrado || 0,
      preco_mao_obra: servico.preco_mao_obra || 0,
      valor_total: servico.valor_total || 0,
      status: servico.status || "",
      data_ini: servico.data_ini || "",
      data_fim: servico.data_fim || "",
      data_garantia: servico.data_garantia || "",
      clienteId: servico.cliente?.id || "",
      carroId: servico.carro?.id || "",
    });

    // atualiza lista de carros filtrados pro cliente desse serviço
    const filtrados = carros.filter(
      (c) => c.cliente && c.cliente.id === servico.cliente.id
    );
    setCarrosFiltrados(filtrados);

    setEditId(servico.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await api.delete(`/servico/${id}`); // ou /servicos/${id}
      await carregarServicos();
    } catch (e) {
      console.error("Erro ao excluir serviço:", e);
    }
  }

  return (
    <div className="servico-page">
      <h1>Serviços</h1>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="form-servico">
        <div>
          <label>Cliente:</label>
          <select
            name="clienteId"
            value={formData.clienteId}
            onChange={handleChange}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} - {c.cpf}
              </option>
            ))}
          </select>
        </div>

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
          <label>Preço Peça (pago):</label>
          <input
            type="number"
            step="0.01"
            name="preco_peca_pago"
            value={formData.preco_peca_pago}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Preço Peça (cobrado):</label>
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
            readOnly
          />
        </div>

        <div>
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Em andamento, Concluído, etc."
          />
        </div>

        <button type="submit">
          {editId ? "Atualizar Serviço" : "Cadastrar Serviço"}
        </button>
      </form>

      {/* TABELA DE SERVIÇOS */}
      <table className="tabela-servico">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Carro</th>
            <th>Descrição</th>
            <th>Peça (cobrado)</th>
            <th>Mão de obra</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((s) => (
            <tr key={s.id}>
              <td>{s.cliente?.nome}</td>
              <td>
                {s.carro?.modelo} - {s.carro?.placa}
              </td>
              <td>{s.descricao}</td>
              <td>{s.preco_peca_cobrado}</td>
              <td>{s.preco_mao_obra}</td>
              <td>{s.valor_total}</td>
              <td>{s.status}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Editar</button>
                <button onClick={() => handleDelete(s.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
