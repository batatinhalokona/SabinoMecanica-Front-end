// ============================
// Importações principais
// ============================
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// ============================
// Layout base e rotas protegidas
// ============================
import App from "./App"; 
import RotaPrivada from "./router/RotaPrivada";

// ============================
// Páginas principais
// ============================
import Login from "./pages/Login";
import Home from "./pages/Home";

// ============================
// Páginas de Clientes (APENAS UMA)
// ============================
import Clientes from "./pages/Clientes/Clientes";

// ============================
// Páginas de Serviços
// ============================
import Servicos from "./pages/Servicos/Servicos";
import ServicoAndamento from "./pages/Servicos/ServicoAndamento";
import ServicoGarantia from "./pages/Servicos/ServicoGarantia";
import ServicoHistorico from "./pages/Servicos/ServicoHistorico";

// ============================
// Páginas de Registro (APENAS UMA)
// ============================
import Registro from "./pages/Registro/Registro";

// ============================
// Páginas de Estoque (APENAS UMA)
// ============================
import Estoque from "./pages/Estoque/Estoque";

// ============================
// CSS Global
// ============================
import "./index.css";
import "./App.css";

// ============================
// Rotas
// ============================
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout principal
    children: [
      // ====== Login ======
      { path: "/login", element: <Login /> },

      // ====== Home ======
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

      // ====== Registro ======
      {
        path: "/registro",
        element: (
          <RotaPrivada>
            <Registro />
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
    ],
  },
]);

// ============================
// Renderização
// ============================
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
