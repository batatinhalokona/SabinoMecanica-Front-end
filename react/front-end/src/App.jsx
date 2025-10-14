// Importações principais do React Router e hooks
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";

// Componentes globais
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// Páginas principais
import Login from "./pages/Login";
import Home from "./pages/Home";

// Páginas da área de Registro (organizadas na pasta /Registro)
import Registro from "./pages/Registro/Registro";
import NovoCliente from "./pages/Registro/NovoCliente";
import NovoServico from "./pages/Registro/NovoServico";
import NovoCarro from "./pages/Registro/NovoCarro";

// Páginas de Clientes
import Clientes from "./pages/Clientes/Clientes";
import ClientesAndamentos from "./pages/Clientes/ClientesAndamentos";
import ClientesPendentes from "./pages/Clientes/ClientesPendentes";
import ClientesHistorico from "./pages/Clientes/ClientesHistorico";

// Páginas de Serviços
import Servicos from "./pages/Servicos/Servicos";
import ServicoAndamento from "./pages/Servicos/ServicoAndamento";
import ServicoGarantia from "./pages/Servicos/ServicoGarantia";
import ServicoHistorico from "./pages/Servicos/ServicoHistorico";

function App() {
  const location = useLocation(); // hook para saber a rota atual
  const navigate = useNavigate(); // hook para redirecionar
  const usuario = JSON.parse(localStorage.getItem("usuario")); // verifica login

  // Define quais páginas não exibem Navbar/Footer
  const isLoginPage = location.pathname === "/login";
  const isHomePage = location.pathname === "/home";

  // Redirecionamento se não estiver logado
  useEffect(() => {
    if (!usuario && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [usuario, location.pathname, navigate]);

  return (
    <>
      {/* ✅ Só mostra Navbar se não estiver no Login nem na Home */}
      {!isLoginPage && !isHomePage && <NavBar />}

      <Routes>
        {/* Páginas principais */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* Clientes */}
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/clientes/andamento" element={<ClientesAndamentos />} />
        <Route path="/clientes/pendentes" element={<ClientesPendentes />} />
        <Route path="/clientes/historico" element={<ClientesHistorico />} />

        {/* Serviços */}
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servicos/andamento" element={<ServicoAndamento />} />
        <Route path="/servicos/garantia" element={<ServicoGarantia />} />
        <Route path="/servicos/historico" element={<ServicoHistorico />} />

        {/* Registro */}
        <Route path="/registro" element={<Registro />} />
        <Route path="/novo-cliente" element={<NovoCliente />} />
        <Route path="/novo-servico" element={<NovoServico />} />
        <Route path="/novo-carro" element={<NovoCarro />} />
      </Routes>

      {/* ✅ Só mostra Footer se não estiver no Login nem na Home */}
      {!isLoginPage && !isHomePage && <Footer />}
    </>
  );
}

export default App;
