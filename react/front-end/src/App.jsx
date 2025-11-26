import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  const location = useLocation();

  // Verifica se está na página de login
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {isLoginPage ? (
        // Login sem layout, sem nav e sem fundo
        <Outlet />
      ) : (
        // Todas as outras páginas com layout padrão + nav + footer
        <div className="padrao-fundo">
          <NavBar />
          <Outlet />
          <Footer />
        </div>
      )}
    </>
  );
}
