import "./Servicos.css";
import { useNavigate } from "react-router-dom";

export default function ServicoHistorico() {
  const navigate = useNavigate();

  const servicos = [
    { id: 1, cliente: "Marcos Silva", descricao: "Troca de freios", data: "05/07/2024" },
    { id: 2, cliente: "Clara Nunes", descricao: "Revisão completa", data: "20/08/2024" },
  ];

  return (
    <div className="servicos-container">
      <button className="voltar-btn" onClick={() => navigate("/servicos")}>
        ← Voltar
      </button>
      <h1>📜 Histórico de Serviços</h1>
      <div className="servicos-grid">
        {servicos.map((s) => (
          <div key={s.id} className="servico-card historico-card">
            <h3>{s.cliente}</h3>
            <p><strong>Serviço:</strong> {s.descricao}</p>
            <p><strong>Data:</strong> {s.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
