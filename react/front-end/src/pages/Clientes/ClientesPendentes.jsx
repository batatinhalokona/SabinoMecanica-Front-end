import "./Clientes.css";

export default function ClientesPendentes() {
  const clientes = [
    { id: 1, nome: "João Lima", servico: "Pintura completa", valor: "R$ 1.200,00" },
    { id: 2, nome: "Clara Mendes", servico: "Troca de pneus", valor: "R$ 800,00" },
  ];

  return (
    <div className="clientes-container">
      <h1>💸 Clientes Pendentes</h1>
      <div className="clientes-grid">
        {clientes.map((c) => (
          <div key={c.id} className="cliente-card pendente-card">
            <h3>{c.nome}</h3>
            <p><strong>Serviço:</strong> {c.servico}</p>
            <p><strong>Valor:</strong> {c.valor}</p>
            <p><em>Aguardando pagamento...</em></p>
          </div>
        ))}
      </div>
    </div>
  );
}
