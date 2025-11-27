// src/pages/Servicos/Servicos.jsx

import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Servicos() {
  // listas vindas do back
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [carrosFiltrados, setCarrosFiltrados] = useState([]);

  // peças do serviço (apenas front)
  const [itensPeca, setItensPeca] = useState([]);
  const [novoItem, setNovoItem] = useState({
    descricao: "",
    preco_pago: "",
    preco_cobrado: "",
  });

  // form principal (preco_peca_* só pro cálculo/visualização no front)
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

  // carregar dados iniciais
  useEffect(() => {
    carregarClientes();
    carregarCarros();
    carregarServicos();
  }, []);

  async function carregarClientes() {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (e) {
      console.error("Erro ao buscar clientes:", e);
    }
  }

  async function carregarCarros() {
    try {
      const res = await api.get("/carros");
      setCarros(res.data);
    } catch (e) {
      console.error("Erro ao buscar carros:", e);
    }
  }

  async function carregarServicos() {
    try {
      const res = await api.get("/servicos");
      setServicos(res.data);
    } catch (e) {
      console.error("Erro ao buscar serviços:", e);
    }
  }

  // mudanças nos campos principais
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => {
      let novo = { ...prev, [name]: value };

      // quando muda o cliente, filtra carros daquele cliente
      if (name === "clienteId") {
        novo.carroId = "";
        const filtrados = carros.filter(
          (c) => c.cliente && c.cliente.id === value
        );
        setCarrosFiltrados(filtrados);
      }

      // atualiza mão de obra e recalcula valor_total
      if (name === "preco_mao_obra") {
        const mao = parseFloat(value) || 0;
        const totalPecasCobradas = prev.preco_peca_cobrado || 0;
        novo.preco_mao_obra = mao;
        novo.valor_total = mao + totalPecasCobradas;
      }

      return novo;
    });
  }

  // mudança nos inputs da nova peça
  function handleNovoItemChange(e) {
    const { name, value } = e.target;
    setNovoItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // adiciona peça na tabela
  function adicionarItemPeca() {
    if (!novoItem.descricao.trim()) return;

    const precoPago = parseFloat(novoItem.preco_pago) || 0;
    const precoCobrado = parseFloat(novoItem.preco_cobrado) || 0;

    const item = {
      descricao: novoItem.descricao,
      preco_pago: precoPago,
      preco_cobrado: precoCobrado,
    };

    // adiciona item na lista
    setItensPeca((prev) => [...prev, item]);

    // atualiza totais no form (somente front)
    setFormData((prev) => {
      const novoPago = (prev.preco_peca_pago || 0) + precoPago;
      const novoCobrado =
        (prev.preco_peca_cobrado || 0) + precoCobrado;
      const novoTotal = novoCobrado + (prev.preco_mao_obra || 0);

      return {
        ...prev,
        preco_peca_pago: novoPago,
        preco_peca_cobrado: novoCobrado,
        valor_total: novoTotal,
      };
    });

    // limpa inputs da peça
    setNovoItem({
      descricao: "",
      preco_pago: "",
      preco_cobrado: "",
    });
  }

  // remover peça da lista
  function removerItemPeca(index) {
    const itemRemovido = itensPeca[index];

    setItensPeca((prev) => prev.filter((_, i) => i !== index));

    // atualiza totais
    setFormData((prev) => {
      const novoPago =
        (prev.preco_peca_pago || 0) - itemRemovido.preco_pago;
      const novoCobrado =
        (prev.preco_peca_cobrado || 0) - itemRemovido.preco_cobrado;
      const novoTotal = novoCobrado + (prev.preco_mao_obra || 0);

      return {
        ...prev,
        preco_peca_pago: novoPago,
        preco_peca_cobrado: novoCobrado,
        valor_total: novoTotal,
      };
    });
  }

  // salvar serviço (criar / editar)
  async function handleSubmit(e) {
    e.preventDefault();

    // monta payload SEM preco_peca_* (back não tem mais esses campos)
    const payload = {
      descricao: formData.descricao,
      preco_mao_obra: formData.preco_mao_obra,
      valor_total: formData.valor_total,
      status: formData.status,
      data_ini: formData.data_ini,
      data_fim: formData.data_fim,
      data_garantia: formData.data_garantia,
      carro: { id: formData.carroId },
      cliente: { id: formData.clienteId },

      // lista de peças que serão salvas na tabela servico_peca
      itens: itensPeca.map((item) => ({
        descricao: item.descricao,
        precoPago: item.preco_pago,
        precoCobrado: item.preco_cobrado,
      })),
    };

    try {
      if (editId) {
        await api.put(`/servicos/${editId}`, payload);
      } else {
        await api.post("/servicos", payload);
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
    setItensPeca([]);
    setNovoItem({
      descricao: "",
      preco_pago: "",
      preco_cobrado: "",
    });
    setCarrosFiltrados([]);
    setEditId(null);
  }

  // editar serviço existente
  function handleEdit(servico) {
    // converte datas se vierem com horário (2025-11-26T00:00:00 → 2025-11-26)
    const parseDate = (d) =>
      d ? String(d).substring(0, 10) : "";

    // se já tiver itens vindo do back, recria lista de peças no front
    const itens = Array.isArray(servico.itens) ? servico.itens : [];
    const itensFront = itens.map((i) => ({
      descricao: i.descricao,
      preco_pago: i.precoPago,
      preco_cobrado: i.precoCobrado,
    }));

    // soma de peças (só front)
    const totalPago = itensFront.reduce(
      (acc, i) => acc + (i.preco_pago || 0),
      0
    );
    const totalCobrado = itensFront.reduce(
      (acc, i) => acc + (i.preco_cobrado || 0),
      0
    );

    setFormData({
      descricao: servico.descricao || "",
      preco_peca_pago: totalPago,
      preco_peca_cobrado: totalCobrado,
      preco_mao_obra: servico.preco_mao_obra || 0,
      valor_total: servico.valor_total || totalCobrado + (servico.preco_mao_obra || 0),
      status: servico.status || "",
      data_ini: parseDate(servico.data_ini),
      data_fim: parseDate(servico.data_fim),
      data_garantia: parseDate(servico.data_garantia),
      clienteId: servico.cliente?.id || "",
      carroId: servico.carro?.id || "",
    });

    // atualiza carros daquele cliente
    const filtrados = carros.filter(
      (c) => c.cliente && c.cliente.id === servico.cliente.id
    );
    setCarrosFiltrados(filtrados);

    // carrega peças do serviço na tabela
    setItensPeca(itensFront);
    setEditId(servico.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await api.delete(`/servicos/${id}`);
      await carregarServicos();
    } catch (e) {
      console.error("Erro ao excluir serviço:", e);
    }
  }

  return (
    <div className="servico-page">
      <h1>Serviços</h1>

      {/* FORMULÁRIO PRINCIPAL */}
      <form onSubmit={handleSubmit} className="form-servico">
        {/* Cliente e Carro */}
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

        {/* Datas */}
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
          <label>Descrição do Serviço:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>

        {/* TABELA DE PEÇAS */}
        <h3>Peças usadas</h3>

        <div className="linha-nova-peca">
          <input
            type="text"
            name="descricao"
            placeholder="Nome da peça"
            value={novoItem.descricao}
            onChange={handleNovoItemChange}
          />
          <input
            type="number"
            step="0.01"
            name="preco_pago"
            placeholder="Preço pago"
            value={novoItem.preco_pago}
            onChange={handleNovoItemChange}
          />
          <input
            type="number"
            step="0.01"
            name="preco_cobrado"
            placeholder="Preço cobrado"
            value={novoItem.preco_cobrado}
            onChange={handleNovoItemChange}
          />
          <button type="button" onClick={adicionarItemPeca}>
            Adicionar peça
          </button>
        </div>

        {itensPeca.length > 0 && (
          <table className="tabela-pecas">
            <thead>
              <tr>
                <th>Peça</th>
                <th>Pago</th>
                <th>Cobrado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itensPeca.map((item, index) => (
                <tr key={index}>
                  <td>{item.descricao}</td>
                  <td>{item.preco_pago.toFixed(2)}</td>
                  <td>{item.preco_cobrado.toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removerItemPeca(index)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Totais das peças (só front, pra tua conferência) */}
        <div>
          <label>Total peças (pago):</label>
          <input
            type="number"
            step="0.01"
            value={formData.preco_peca_pago}
            readOnly
          />
        </div>

        <div>
          <label>Total peças (cobrado):</label>
          <input
            type="number"
            step="0.01"
            value={formData.preco_peca_cobrado}
            readOnly
          />
        </div>

        {/* Mão de obra e total */}
        <div>
          <label>Mão de obra:</label>
          <input
            type="number"
            step="0.01"
            name="preco_mao_obra"
            value={formData.preco_mao_obra}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Valor total:</label>
          <input
            type="number"
            step="0.01"
            value={formData.valor_total}
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
