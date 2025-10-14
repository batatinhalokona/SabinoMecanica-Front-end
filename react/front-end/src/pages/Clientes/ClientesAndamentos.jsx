import "./Clientes.css";

export default function ClientesAndamento() {
  const clientes = [
    { id: 1, nome: "Maria Silva", servico: "Troca de embreagem", status: "Em teste final" },
    { id: 2, nome: "Pedro Costa", servico: "Revisão completa", status: "50%" },
  ];

  return (
    <div className="clientes-container">
      <h1>🔧 Clientes em Andamento</h1>
      <div className="clientes-grid">
        {clientes.map((c) => (
          <div key={c.id} className="cliente-card andamento-card">
            <h3>{c.nome}</h3>
            <p><strong>Serviço:</strong> {c.servico}</p>
            <p><strong>Status:</strong> {c.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
