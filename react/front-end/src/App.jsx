import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Verifica páginas especiais
  const isLoginPage = location.pathname === "/login";
  const isHomePage = location.pathname === "/home";

  // Redireciona para login se não estiver logado
  useEffect(() => {
    if (!usuario && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [usuario, location.pathname, navigate]);

  return (
    <>
      {isLoginPage ? (
        // Tela de login (sem fundo padrão)
        <Outlet />
      ) : (
        // Todas as outras telas com o fundo bege
        <div className="padrao-fundo">
          {!isHomePage && <NavBar />}
          <Outlet />
          {!isHomePage && <Footer />}
        </div>
      )}
    </>
  );
}
