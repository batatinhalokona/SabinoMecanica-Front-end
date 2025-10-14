import "./Registro.css";
import { useNavigate } from "react-router-dom";

export default function NovoServico() {
  const navigate = useNavigate();

  return (
    <div className="registro-container">
      <button className="voltar-btn" onClick={() => navigate("/registro")}>
        ← Voltar
      </button>

      <h1>🧰 Novo Serviço</h1>
      <form className="registro-form">
        <label>Nome do Cliente</label>
        <input type="text" placeholder="Ex: Carlos Mendes" required />

        <label>Serviço</label>
        <input type="text" placeholder="Troca de óleo, revisão..." required />

        <label>Descrição</label>
        <textarea placeholder="Detalhes do serviço..." required></textarea>

        <label>Valor (R$)</label>
        <input type="number" placeholder="Ex: 150.00" required />

        <label>Data</label>
        <input type="date" required />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
