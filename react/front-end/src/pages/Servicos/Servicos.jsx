import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Servicos.css";
import carroFundo from "../../assets/peugeotlogo.png"; // Imagem do Peugeot

export default function Servicos() {
  const navigate = useNavigate();
  const [animar, setAnimar] = useState(false);

  // Dispara a animação quando o componente é montado
  useEffect(() => {
    setTimeout(() => setAnimar(true), 100);
  }, []);

  return (
    <div className="servicos-container">
      {/* Cabeçalho central */}
      <header className="servicos-header">
        <h1>🧰 Serviços da Oficina Sabino</h1>
        <p>Gerencie todos os serviços realizados e em andamento.</p>
      </header>

      <div className={`servicos-content ${animar ? "animar" : ""}`}>
        {/* Lado esquerdo - imagem */}
        <div className="servicos-imagem">
          <img src={carroFundo} alt="Carro Peugeot" />
        </div>

        {/* Lado direito - cards */}
        <div className="servicos-cards">
          <div className="card" onClick={() => navigate("/servicos/andamento")}>
            <h2>🔧 Em Andamento</h2>
            <p>Acompanhe os serviços que estão em execução.</p>
          </div>

          <div className="card" onClick={() => navigate("/servicos/garantia")}>
            <h2>🛠️ Garantia</h2>
            <p>Controle os retornos e manutenções sob garantia.</p>
          </div>

          <div className="card" onClick={() => navigate("/servicos/historico")}>
            <h2>📜 Histórico</h2>
            <p>Veja o histórico completo dos serviços concluídos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
