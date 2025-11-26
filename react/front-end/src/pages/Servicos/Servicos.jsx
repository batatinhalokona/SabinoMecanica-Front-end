// Importa os hooks do React
import { useEffect, useState } from "react";
// Importa a configuração do axios (baseURL, etc.)
import api from "../../api/api";

// Componente de página de Serviços
export default function Servicos() {
  // Estado com a lista de serviços vindos do back-end
  const [servicos, setServicos] = useState([]);

  // Estado com os dados do formulário de serviço
  const [formData, setFormData] = useState({
    data_ini: "",           // mesma coisa que no back: Date data_ini;
    data_fim: "",           // Date data_fim;
    data_garantia: "",      // Date data_garantia;
    descricao: "",          // String descricao;
    preco_peca_pago: 0,     // double preco_peca_pago;
    preco_peca_cobrado: 0,  // double preco_peca_cobrado;
    preco_mao_obra: 0,      // double preco_mao_obra;
    valor_total: 0,         // double valor_total;
    status: "",             // campo "Status" no Java gera JSON "status"
  });

  // Estado para saber se está editando algum serviço (guarda o id)
  const [editId, setEditId] = useState(null);

  // Ao carregar a página, busca todos os serviços
  useEffect(() => {
    carregarServicos();
  }, []);

  // Função que busca serviços no back-end
  async function carregarServicos() {
    try {
      // Faz um GET na rota de serviços (ajuste se sua URL for diferente)
      const response = await api.get("/api/servico");
      // Salva a lista no estado
      setServicos(response.data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  }

  // Função para atualizar o formulário quando o usuário digita
  function handleChange(e) {
    // Pega o nome do campo e o valor digitado
    const { name, value } = e.target;

    // Usa setFormData em formato de função para garantir o estado anterior
    setFormData((prev) => {
      // Começa copiando todo o objeto anterior
      const novo = { ...prev, [name]: value };

      // Converte campos numéricos para número
      if (
        name === "preco_peca_pago" ||
        name === "preco_peca_cobrado" ||
        name === "preco_mao_obra"
      ) {
        // Usa parseFloat para transformar string em número
        novo[name] = parseFloat(value) || 0;
      }

      // Recalcula o valor_total sempre que preço da peça cobrado ou mão de obra mudarem
      // (aqui estou considerando valor_total = preco_peca_cobrado + preco_mao_obra)
      novo.valor_total =
        (parseFloat(novo.preco_peca_cobrado) || 0) +
        (parseFloat(novo.preco_mao_obra) || 0);

      // Retorna o novo objeto atualizado
      return novo;
    });
  }

  // Envia o formulário (cria ou atualiza um serviço)
  async function handleSubmit(e) {
    // Impede o reload da página
    e.preventDefault();

    try {
      if (editId) {
        // Se tiver editId, faz um PUT (edição)
        await api.put(`/api/servico/${editId}`, formData);
      } else {
        // Se não tiver editId, faz um POST (novo serviço)
        await api.post("/api/servico", formData);
      }

      // Depois de salvar, recarrega a lista de serviços
      await carregarServicos();

      // Limpa o formulário
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
      });
      // Sai do modo edição
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
    }
  }

  // Quando clicar em "Editar" em algum serviço da tabela
  function handleEdit(servico) {
    // Preenche o formulário com os dados do serviço selecionado
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
    });
    // Guarda o id para o PUT
    setEditId(servico.id);
  }

  // Excluir serviço
  async function handleDelete(id) {
    // Confirmação antes de apagar
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      // Faz DELETE no back-end
      await api.delete(`/api/servico/${id}`);
      // Recarrega lista
      await carregarServicos();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
    }
  }

  return (
    <div className="servico-page">
      <h1>Serviços</h1>

      {/* FORMULÁRIO DE SERVIÇO */}
      <form onSubmit={handleSubmit} className="form-servico">
        <div>
          <label>Data Início:</label>
          <input
            type="date"
            name="data_ini"              // igual ao campo do back
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
          <label>Preço Peça (Cobrado do Cliente):</label>
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
            // Se não quiser deixar o usuário mexer direto, pode pôr readOnly
            // readOnly
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

      {/* TABELA DE SERVIÇOS */}
      <table className="tabela-servico">
        <thead>
          <tr>
            <th>Data Início</th>
            <th>Data Fim</th>
            <th>Garantia</th>
            <th>Descrição</th>
            <th>Peça (Pago)</th>
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
              <td>{servico.data_ini}</td>
              <td>{servico.data_fim}</td>
              <td>{servico.data_garantia}</td>
              <td>{servico.descricao}</td>
              <td>{servico.preco_peca_pago}</td>
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
