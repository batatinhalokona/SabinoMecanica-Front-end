// src/pages/Carros.jsx
import React, { useState, useEffect } from 'react';
import { getCarros, saveCarro, deleteCarro } from '../api/CarrosApi';

const CarroVazio = {
    id: null,
    modelo: '',
    placa: '',
};

function Carros() {
    const [carros, setCarros] = useState([]);
    const [carroEditando, setCarroEditando] = useState(CarroVazio);

    const fetchCarros = async () => {
        const data = await getCarros();
        setCarros(data);
    };

    useEffect(() => {
        fetchCarros();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarroEditando(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveCarro(carroEditando);
            setCarroEditando(CarroVazio);
            fetchCarros(); 
        } catch (error) {
            alert('Erro ao salvar o carro.');
        }
    };

    const handleEdit = (carro) => {
        setCarroEditando(carro);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este carro?')) {
            try {
                await deleteCarro(id);
                fetchCarros();
            } catch (error) {
                alert('Erro ao deletar o carro.');
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>🚗 Cadastro de Carros</h2>

            {/* Formulário */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h4>{carroEditando.id ? 'Editar Carro' : 'Novo Carro'}</h4>
                <input name="modelo" value={carroEditando.modelo} onChange={handleChange} placeholder="Modelo (Ex: Fiat Uno)" required />
                <input name="placa" value={carroEditando.placa} onChange={handleChange} placeholder="Placa (Ex: ABC1234)" required style={{ marginLeft: '10px' }}/>
                <br />
                <button type="submit">Salvar Carro</button>
                {carroEditando.id && (
                    <button type="button" onClick={() => setCarroEditando(CarroVazio)} style={{ marginLeft: '10px' }}>
                        Cancelar Edição
                    </button>
                )}
            </form>

            {/* Lista */}
            <h3>Carros Cadastrados</h3>
            <table>
                <thead>
                    <tr><th>ID</th><th>Modelo</th><th>Placa</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {carros.map(carro => (
                        <tr key={carro.id}>
                            <td>{carro.id}</td>
                            <td>{carro.modelo}</td>
                            <td>{carro.placa}</td>
                            <td>
                                <button onClick={() => handleEdit(carro)}>Editar</button>
                                <button onClick={() => handleDelete(carro.id)} style={{ marginLeft: '5px' }}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Carros;