// Importa os hooks do React
import { useEffect, useState } from "react";
// Importa a instância do axios configurada
import api from "../../api/api";

// Componente de página de Carros
export default function Carros() {
  // Estado com a lista de carros vindos do back-end
  const [carros, setCarros] = useState([]);

  // Estado com os dados do formulário de carro
  const [formData, setFormData] = useState({
    modelo: "",   // mesmo nome do campo no back
    placa: "",    // mesmo nome do campo no back
    url_foto: "", // mesmo nome do campo no back
  });

  // Guarda o id do carro que está sendo editado (se houver)
  const [editId, setEditId] = useState(null);

  // Ao montar o componente, carrega os carros
  useEffect(() => {
    carregarCarros();
  }, []);

  // Função que busca os carros no back-end
  async function carregarCarros() {
    try {
      // Faz GET na rota de carros (ajuste a URL se precisar)
      const response = await api.get("/carros");
      // Salva resultado em "carros"
      setCarros(response.data);
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
    }
  }

  // Atualiza o formulário quando o usuário digita
  function handleChange(e) {
    // Pega nome do campo e valor digitado
    const { name, value } = e.target;

    // Atualiza o estado do formulário
    setFormData((prev) => ({
      ...prev,      // copia todos os campos anteriores
      [name]: value // atualiza só o campo modificado
    }));
  }

  // Envia o formulário (criar ou atualizar carro)
  async function handleSubmit(e) {
    // Evita reload da página
    e.preventDefault();

    try {
      if (editId) {
        // Se tiver editId, faz PUT
        await api.put(`/carros/${editId}`, formData);
      } else {
        // Se não tiver editId, faz POST
        await api.post("/carros", formData);
      }

      // Depois de salvar, recarrega a lista
      await carregarCarros();

      // Limpa o formulário
      setFormData({
        modelo: "",
        placa: "",
        url_foto: "",
      });
      // Sai do modo edição
      setEditId(null);
    } catch (error) {
      console.error("Erro ao salvar carro:", error);
    }
  }

  // Quando clicar em "Editar" em algum carro
  function handleEdit(carro) {
    // Preenche o formulário com os dados desse carro
    setFormData({
      modelo: carro.modelo || "",
      placa: carro.placa || "",
      url_foto: carro.url_foto || "",
    });
    // Guarda o id para usar no PUT
    setEditId(carro.id);
  }

  // Excluir carro
  async function handleDelete(id) {
    // Confirma antes de excluir
    if (!window.confirm("Tem certeza que deseja excluir este carro?")) return;

    try {
      // Faz DELETE no back-end
      await api.delete(`/carros/${id}`);
      // Recarrega a lista
      await carregarCarros();
    } catch (error) {
      console.error("Erro ao excluir carro:", error);
    }
  }

  return (
    <div className="carro-page">
      <h1>Carros</h1>

      {/* FORMULÁRIO DE CARRO */}
      <form onSubmit={handleSubmit} className="form-carro">
        <div>
          <label>Modelo:</label>
          <input
            type="text"
            name="modelo"            // TEM QUE SER "modelo"
            value={formData.modelo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Placa:</label>
          <input
            type="text"
            name="placa"             // TEM QUE SER "placa"
            value={formData.placa}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>URL da Foto:</label>
          <input
            type="text"
            name="url_foto"          // TEM QUE SER "url_foto"
            value={formData.url_foto}
            onChange={handleChange}
            placeholder="https://imagem-do-carro.jpg"
          />
        </div>

        <button type="submit">
          {editId ? "Atualizar Carro" : "Cadastrar Carro"}
        </button>
      </form>

      {/* TABELA DE CARROS */}
      <table className="tabela-carro">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Foto</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carros.map((carro) => (
            <tr key={carro.id}>
              <td>{carro.modelo}</td>
              <td>{carro.placa}</td>
              <td>
                {/* Se tiver URL, mostra uma miniatura da imagem */}
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
