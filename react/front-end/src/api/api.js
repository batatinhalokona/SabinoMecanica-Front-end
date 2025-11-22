// src/api/api.js
import axios from "axios";

// Instância do Axios apontando para o backend Java (Spring Boot)
const api = axios.create({
  // IMPORTANTE: não colocar /api aqui,
  // porque nas chamadas usamos "/api/clientes", "/api/servicos", etc.
  baseURL: "http://localhost:8080",
});

export default api;
