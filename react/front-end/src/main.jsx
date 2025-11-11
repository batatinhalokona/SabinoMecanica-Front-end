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
import Servicos from "./pages/Servico";
// ============================
// Importa páginas de Clientes
// ============================
import Clientes from "./pages/Clientes";
// ============================
// Importa páginas de Carros
// ============================
import Carros from "./pages/Carros";
// ============================
// Importa páginas de Registro
// ============================
import Categorias from "./pages/Categorias";
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
        path: "/api/clientes",
        element: (
          <RotaPrivada>
            <Clientes />
          </RotaPrivada>
        ),
      },
      // ====== Serviços ======
      {
        path: "/api/servicos",
        element: (
          <RotaPrivada>
            <Servicos />
          </RotaPrivada>
        ),
      },

      // ====== Registro ======
      {
        path: "/api/Carros",
        element: (
          <RotaPrivada>
            <Carros />
          </RotaPrivada>
        ),
      },
      {
        path: "/api/categorias",
        element: (
          <RotaPrivada>
            <Categorias />
          </RotaPrivada>
        ),
      },
  // ====== Login ======
  {
    path: "/login",
    element: <Login />,
  },
    ], // Closing bracket for children array
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
