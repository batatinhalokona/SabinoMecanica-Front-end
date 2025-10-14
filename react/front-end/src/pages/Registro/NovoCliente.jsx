import "./Registro.css";
import { useNavigate } from "react-router-dom";

export default function NovoCliente() {
  const navigate = useNavigate();

  return (
    <div className="registro-container">
      <button className="voltar-btn" onClick={() => navigate("/registro")}>
        ← Voltar
      </button>

      <h1>👤 Novo Cliente</h1>
      <form className="registro-form">
        <label>Nome</label>
        <input type="text" placeholder="Ex: João da Silva" required />

        <label>CPF</label>
        <input type="text" placeholder="000.000.000-00" required />

        <label>Telefone</label>
        <input type="text" placeholder="(00) 00000-0000" required />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
