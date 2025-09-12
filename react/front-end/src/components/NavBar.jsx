// Importa o Link para navegação entre rotas e useNavigate para redirecionamento programado
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css"; // Importa o arquivo de estilos específico da NavBar

// Componente de navegação principal da aplicação
export default function NavBar() {
  const navigate = useNavigate(); // Hook para redirecionamento manual

  // Recupera os dados do usuário logado
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Função chamada ao clicar no botão "Sair"
  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Limpa os dados salvos do usuário
    navigate("/login"); // Redireciona para a tela de login
  };

  // Estrutura visual da barra de navegação
  return (
    <nav className="navbar">
      {/* Bloco com os links de navegação */}
      <div className="navbar-links">
        {/* Link para a página inicial (Home) */}
        <Link to="/home" className="nav-link">
          Home
        </Link>

        {/* Link para a tela de serviços */}
        <Link to="/servicos" className="nav-link">
          Serviços
        </Link>

        {/* Link para a tela de clientes */}
        <Link to="/clientes" className="nav-link">
          Clientes
        </Link>

        {/* Link para a tela de fotos e anotações */}
        <Link to="/fotos" className="nav-link">
          Fotos e Anotações
        </Link>
      </div>

      {/* Botão de logout, sempre visível para o gerente */}
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Sair
      </button>

    </nav>
  );
}
