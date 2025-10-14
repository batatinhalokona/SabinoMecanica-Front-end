import "./Clientes.css";

export default function ClientesHistorico() {
  const clientes = [
    { id: 1, nome: "Carlos Mendes", servico: "Troca de óleo", data: "12/08/2024" },
    { id: 2, nome: "Ana Souza", servico: "Freio e suspensão", data: "28/09/2024" },
  ];

  return (
    <div className="clientes-container">
      <h1>📜 Histórico de Clientes</h1>
      <div className="clientes-grid">
        {clientes.map((c) => (
          <div key={c.id} className="cliente-card historico-card">
            <h3>{c.nome}</h3>
            <p><strong>Serviço:</strong> {c.servico}</p>
            <p><strong>Data:</strong> {c.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
