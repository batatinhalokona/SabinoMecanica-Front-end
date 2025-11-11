// src/api/carrosApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/carros';

export const getCarros = async () => (await axios.get(API_URL)).data;

export const saveCarro = async (carroData) => {
    if (carroData.id) {
        return await axios.put(`${API_URL}/${carroData.id}`, carroData);
    }
    return await axios.post(API_URL, carroData);
};

export const deleteCarro = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};