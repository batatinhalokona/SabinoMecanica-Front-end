// src/api/api.js

import axios from "axios";

// Instância global do Axios com base URL do back-end Java Spring
const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Se no futuro você usar autenticação, o token pode ser colocado aqui
api.interceptors.request.use((config) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario && usuario.token) {
    config.headers.Authorization = `Bearer ${usuario.token}`;
  }

  return config;
});

export default api;
