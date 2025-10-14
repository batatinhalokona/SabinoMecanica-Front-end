import "./Servicos.css";
import { useNavigate } from "react-router-dom";

export default function ServicoAndamento() {
  const navigate = useNavigate();

  const servicos = [
    { id: 1, cliente: "Carlos Mendes", descricao: "Troca de embreagem", status: "60%" },
    { id: 2, cliente: "Ana Souza", descricao: "Revisão completa", status: "em teste final" },
  ];

  return (
    <div className="servicos-container">
      <button className="voltar-btn" onClick={() => navigate("/servicos")}>
        ← Voltar
      </button>
      <h1>🔧 Serviços em Andamento</h1>
      <div className="servicos-grid">
        {servicos.map((s) => (
          <div key={s.id} className="servico-card andamento-card">
            <h3>{s.cliente}</h3>
            <p><strong>Serviço:</strong> {s.descricao}</p>
            <p><strong>Status:</strong> {s.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
