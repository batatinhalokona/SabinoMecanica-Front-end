import { Link } from "react-router-dom";
import "./Servicos.css";

export default function Servicos() {
  return (
    <div className="servicos-container">
      <h1>🧰 Gerenciamento de Serviços</h1>
      <p>Selecione a categoria de serviço:</p>

      <div className="servicos-menu">
        <Link to="/servicos/andamento" className="servico-card andamento-card">
          <h2>🔧 Serviços em Andamento</h2>
          <p>Veja os serviços que estão em execução na oficina.</p>
        </Link>

        <Link to="/servicos/garantia" className="servico-card garantia-card">
          <h2>🛠️ Garantia de Serviço</h2>
          <p>Controle serviços que retornaram para ajustes.</p>
        </Link>

        <Link to="/servicos/historico" className="servico-card historico-card">
          <h2>📜 Histórico de Serviços</h2>
          <p>Visualize todos os serviços já concluídos.</p>
        </Link>
      </div>
    </div>
  );
}
