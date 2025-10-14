import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo / título */}
      <div className="navbar-logo" onClick={() => navigate("/home")}>
        🔧 <span>Sabino Mecânica</span>
      </div>

      {/* Botão hamburguer (mobile) */}
      <button
        className="menu-toggle"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        ☰
      </button>

      {/* Links principais */}
      <div className={`navbar-links ${menuAberto ? "ativo" : ""}`}>
        <Link to="/home" onClick={() => setMenuAberto(false)}>
          🏠 Home
        </Link>
        <Link to="/servicos" onClick={() => setMenuAberto(false)}>
          🧰 Serviços
        </Link>
        <Link to="/clientes" onClick={() => setMenuAberto(false)}>
          👤 Clientes
        </Link>
        <Link to="/registro" onClick={() => setMenuAberto(false)}>
          📋 Registro
        </Link>
        <button className="logout" onClick={handleLogout}>
          🚪 Sair
        </button>
      </div>
    </nav>
  );
}
