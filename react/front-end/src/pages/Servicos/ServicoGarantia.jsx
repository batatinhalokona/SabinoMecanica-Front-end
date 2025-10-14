import "./Servicos.css";
import { useNavigate } from "react-router-dom";

export default function ServicoGarantia() {
  const navigate = useNavigate();

  const servicos = [
    { id: 1, cliente: "João Lima", descricao: "Reparo de motor", data: "10/08/2024" },
    { id: 2, cliente: "Pedro Costa", descricao: "Troca de amortecedor", data: "25/09/2024" },
  ];

  return (
    <div className="servicos-container">
      <button className="voltar-btn" onClick={() => navigate("/servicos")}>
        ← Voltar
      </button>
      <h1>🛠️ Garantia de Serviço</h1>
      <div className="servicos-grid">
        {servicos.map((s) => (
          <div key={s.id} className="servico-card garantia-card">
            <h3>{s.cliente}</h3>
            <p><strong>Serviço:</strong> {s.descricao}</p>
            <p><strong>Data:</strong> {s.data}</p>
            <p><em>Retorno para verificação em garantia.</em></p>
          </div>
        ))}
      </div>
    </div>
  );
}
