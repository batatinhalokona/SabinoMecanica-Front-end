// ============================
// Importações principais
// ============================
import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

// ============================
// Importa o layout base e rotas protegidas
// ============================
import App from "./App"; // Layout com Navbar + Footer + <Outlet />
import RotaPrivada from "./router/RotaPrivada";

// ============================
// Importa páginas principais
// ============================
import Login from "./pages/Login";
import Home from "./pages/Home";

// ============================
// Importa páginas de Serviços
// ============================
import Servicos from "./pages/Servicos/Servicos";
import ServicoAndamento from "./pages/Servicos/ServicoAndamento";
import ServicoGarantia from "./pages/Servicos/ServicoGarantia";
import ServicoHistorico from "./pages/Servicos/ServicoHistorico";

// ============================
// Importa páginas de Clientes
// ============================
import Clientes from "./pages/Clientes/Clientes";
import ClientesAndamentos from "./pages/Clientes/ClientesAndamentos";
import ClientesPendentes from "./pages/Clientes/ClientesPendentes";
import ClientesHistorico from "./pages/Clientes/ClientesHistorico";

// ============================
// Importa páginas de Registro
// ============================
import Registro from "./pages/Registro/Registro";
import NovoCliente from "./pages/Registro/NovoCliente";
import NovoServico from "./pages/Registro/NovoServico";
import NovoCarro from "./pages/Registro/NovoCarro";

// ============================
// Importa páginas de Estoque
// ============================
import Estoque from "./pages/Estoque/Estoque";
import EstoqueNova from "./pages/Estoque/EstoqueNova";
import EstoqueUsada from "./pages/Estoque/EstoqueUsada";
import EstoqueOleo from "./pages/Estoque/EstoqueOleo";

// ============================
// Importa CSS global
// ============================
import "./index.css";
import "./App.css";

// ============================
// Cria o roteador principal
// ============================
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout base com Navbar, Footer e Outlet
    children: [
      // ====== Página Inicial ======
      {
        path: "/home",
        element: (
          <RotaPrivada>
            <Home />
          </RotaPrivada>
        ),
      },

      // ====== Clientes ======
      {
        path: "/clientes",
        element: (
          <RotaPrivada>
            <Clientes />
          </RotaPrivada>
        ),
      },
      {
        path: "/clientes/andamento",
        element: (
          <RotaPrivada>
            <ClientesAndamentos />
          </RotaPrivada>
        ),
      },
      {
        path: "/clientes/pendentes",
        element: (
          <RotaPrivada>
            <ClientesPendentes />
          </RotaPrivada>
        ),
      },
      {
        path: "/clientes/historico",
        element: (
          <RotaPrivada>
            <ClientesHistorico />
          </RotaPrivada>
        ),
      },

      // ====== Serviços ======
      {
        path: "/servicos",
        element: (
          <RotaPrivada>
            <Servicos />
          </RotaPrivada>
        ),
      },
      {
        path: "/servicos/andamento",
        element: (
          <RotaPrivada>
            <ServicoAndamento />
          </RotaPrivada>
        ),
      },
      {
        path: "/servicos/garantia",
        element: (
          <RotaPrivada>
            <ServicoGarantia />
          </RotaPrivada>
        ),
      },
      {
        path: "/servicos/historico",
        element: (
          <RotaPrivada>
            <ServicoHistorico />
          </RotaPrivada>
        ),
      },

      // ====== Registro ======
      {
        path: "/registro",
        element: (
          <RotaPrivada>
            <Registro />
          </RotaPrivada>
        ),
      },
      {
        path: "/registro/cliente",
        element: (
          <RotaPrivada>
            <NovoCliente />
          </RotaPrivada>
        ),
      },
      {
        path: "/registro/servico",
        element: (
          <RotaPrivada>
            <NovoServico />
          </RotaPrivada>
        ),
      },
      {
        path: "/registro/carro",
        element: (
          <RotaPrivada>
            <NovoCarro />
          </RotaPrivada>
        ),
      },

      // ====== Estoque ======
      {
        path: "/estoque",
        element: (
          <RotaPrivada>
            <Estoque />
          </RotaPrivada>
        ),
      },
      {
        path: "/estoque/novas",
        element: (
          <RotaPrivada>
            <EstoqueNova />
          </RotaPrivada>
        ),
      },
      {
        path: "/estoque/usadas",
        element: (
          <RotaPrivada>
            <EstoqueUsada />
          </RotaPrivada>
        ),
      },
      {
        path: "/estoque/oleo",
        element: (
          <RotaPrivada>
            <EstoqueOleo />
          </RotaPrivada>
        ),
      },
    ],
  },

  // ====== Login ======
  {
    path: "/login",
    element: <Login />,
  },
]);

// ============================
// Renderiza a aplicação
// ============================
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
