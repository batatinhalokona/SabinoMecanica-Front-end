import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
  }, [usuario, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <>
      {/* Faixa azul, fora do container */}
      <div className="home-header">
        <div className="home-user-name">Bem-vindo, {usuario?.nome}</div>
        <button className="home-logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>

      {/* Restante do conteúdo */}
      <div className="home-container">
        <div className="home-card-container">
          <div className="home-card" onClick={() => navigate("/servicos")}>
            <h3>Serviços</h3>
            <p>Gerencie serviços realizados, com nome do cliente, descrição, valor e data.</p>
          </div>

          <div className="home-card" onClick={() => navigate("/clientes")}>
            <h3>Clientes</h3>
            <p>Veja e edite os dados dos clientes: nome, telefone e CPF.</p>
          </div>

          <div className="home-card" onClick={() => navigate("/fotos")}>
            <h3>Fotos e Anotações</h3>
            <p>Adicione fotos dos serviços e anotações internas.</p>
          </div>
        </div>
      </div>
    </>
  );


}
