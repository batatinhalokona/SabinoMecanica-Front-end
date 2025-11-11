// src/api/servicosApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/servicos';

// 1. READ ALL
export const getServicos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        throw error;
    }
};

// 2. CREATE ou UPDATE
export const saveServico = async (servicoData) => {
    try {
        // Envia o objeto Servico completo, incluindo a lista de ItemServico
        if (servicoData.id) {
            return await axios.put(`${API_URL}/${servicoData.id}`, servicoData);
        }
        return await axios.post(API_URL, servicoData);
    } catch (error) {
        console.error("Erro ao salvar serviço:", error);
        throw error;
    }
};

// 3. DELETE
export const deleteServico = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Erro ao deletar serviço:", error);
        throw error;
    }
};

// ** Importante: Você precisará de APIs para buscar Clientes e Carros para os SELECTS **
// (Reutilize getClientes ou crie getCarros se necessário)