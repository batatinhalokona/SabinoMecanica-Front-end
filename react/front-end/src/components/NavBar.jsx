import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import {
  FaHome,
  FaTools,
  FaUser,
  FaFileAlt,
  FaBoxOpen,
  FaCarSide,
  FaWrench,
  FaBars,
} from "react-icons/fa";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      {/* Lado esquerdo - logo */}
      <div className="navbar-left">
        <FaWrench className="navbar-logo-icon" />
        <span className="navbar-logo-text">Sabino Mecânica</span>
      </div>

      

      {/* Lado direito - links */}
      <ul className="navbar-links">
        <li>
          <NavLink to="/home" className={getLinkClass}>
            <FaHome className="nav-icon" />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/servicos" className={getLinkClass}>
            <FaTools className="nav-icon" />
            <span>Serviços</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/clientes" className={getLinkClass}>
            <FaUser className="nav-icon" />
            <span>Clientes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/carros" className={getLinkClass}>
            <FaCarSide className="nav-icon" />
            <span>Carros</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/registro" className={getLinkClass}>
            <FaFileAlt className="nav-icon" />
            <span>Registro</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/estoque" className={getLinkClass}>
            <FaBoxOpen className="nav-icon" />
            <span>Estoque</span>
          </NavLink>
        </li>
      </ul>

      {/* Botão sair */}
      <div className="navbar-right">
        <button className="btn-sair" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}
