// src/App.jsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { useEffect } from "react";

function App() {
  const location = useLocation();                // ✅ useLocation correto
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const isLoginPage = location.pathname === "/login";   // ✅ declare só uma vez
  const isHome = location.pathname === "/home";         // (se precisar usar em estilo/condições)

  useEffect(() => {
    if (!usuario && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [usuario, location.pathname, navigate]); // ✅ dep. corretas

  return (
    <>
      {/* Exibe NavBar em todas as páginas, exceto login */}
      {!isLoginPage && <NavBar />}

      <Outlet />

      {/* Exibe Footer em todas as páginas, exceto login */}
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
