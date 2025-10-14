import { Link } from "react-router-dom";
import "./Clientes.css";

export default function Clientes() {
  return (
    <div className="clientes-container">
      <h1>Gerenciamento de Clientes</h1>
      <p>Selecione uma das opções abaixo:</p>

      <div className="clientes-menu">
        <Link to="/clientes/andamento" className="cliente-card andamento-card">
          <h2>🔧 Clientes em Andamento</h2>
          <p>Veja os clientes que estão com serviços em execução.</p>
        </Link>

        <Link to="/clientes/pendentes" className="cliente-card pendente-card">
          <h2>💸 Clientes Pendentes</h2>
          <p>Clientes com pagamentos em aberto ou em atraso.</p>
        </Link>

        <Link to="/clientes/historico" className="cliente-card historico-card">
          <h2>📜 Histórico de Clientes</h2>
          <p>Visualize serviços já concluídos e finalizados.</p>
        </Link>
      </div>
    </div>
  );
}
