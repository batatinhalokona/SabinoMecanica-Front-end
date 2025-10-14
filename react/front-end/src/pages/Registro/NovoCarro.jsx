import "./Registro.css";
import { useNavigate } from "react-router-dom";

export default function NovoCarro() {
  const navigate = useNavigate();

  return (
    <div className="registro-container">
      <button className="voltar-btn" onClick={() => navigate("/registro")}>
        ← Voltar
      </button>

      <h1>🚗 Novo Carro</h1>
      <form className="registro-form">
        <label>Modelo</label>
        <input type="text" placeholder="Ex: Fusion 2.5" required />

        <label>Marca</label>
        <input type="text" placeholder="Ex: Ford" required />

        <label>Placa</label>
        <input type="text" placeholder="ABC-1234" required />

        <label>Ano</label>
        <input type="number" placeholder="Ex: 2018" required />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
