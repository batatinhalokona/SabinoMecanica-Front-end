// Importa os componentes necessários
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";       // Componente de navegação superior
import Footer from "./components/Footer";       // Componente de rodapé (se quiser, pode personalizar depois)
import { useEffect } from "react";

// Componente principal que envolve todas as telas internas
function App() {
  const isHome = location.pathname === "/home";  // Hook que pega a rota atual
  const navigate = useNavigate();               // Hook para redirecionamento

  // Recupera o usuário logado do localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Proteção de rotas: Se tentar acessar qualquer página sem estar logado, redireciona para o Login
  useEffect(() => {
    if (!usuario && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [usuario, location, navigate]);

  // Condição para ocultar a NavBar e o Footer somente na tela de Login
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Exibe a NavBar apenas se não estiver na tela de login */}
      {!isLoginPage && !isHome && <NavBar />}

      {/* Outlet = espaço onde o conteúdo da rota vai aparecer (ex: Home, Serviços, etc) */}
      <Outlet />

      {/* Exibe o Footer apenas fora da tela de login */}
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
