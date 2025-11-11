// src/api/clientesApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/clientes';

// 1. READ ALL
export const getClientes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error;
    }
};

// 2. CREATE ou UPDATE
export const saveCliente = async (clienteData) => {
    try {
        if (clienteData.id) {
            // Se tem ID, é UPDATE (PUT)
            return await axios.put(`${API_URL}/${clienteData.id}`, clienteData);
        }
        // Se não tem ID, é CREATE (POST)
        return await axios.post(API_URL, clienteData);
    } catch (error) {
        console.error("Erro ao salvar cliente:", error);
        throw error;
    }
};

// 3. DELETE
export const deleteCliente = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        throw error;
    }
};