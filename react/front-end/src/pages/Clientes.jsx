// src/pages/Clientes.jsx
import React, { useState, useEffect } from 'react';
import { getClientes, saveCliente, deleteCliente } from '../api/ClienteApi';

const ClienteFormVazio = {
    id: null,
    nome: '',
    telefone: '',
    email: '',
    // Inclua outros campos do Cliente, como endereço
};

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [clienteEditando, setClienteEditando] = useState(ClienteFormVazio);
    const [loading, setLoading] = useState(true);

    const fetchClientes = async () => {
        setLoading(true);
        const data = await getClientes();
        setClientes(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClienteEditando(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveCliente(clienteEditando);
            setClienteEditando(ClienteFormVazio); // Limpa o formulário
            fetchClientes(); // Recarrega a lista
        } catch (error) {
            alert('Erro ao salvar o cliente.');
        }
    };

    const handleEdit = (cliente) => {
        setClienteEditando(cliente);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
            try {
                await deleteCliente(id);
                fetchClientes();
            } catch (error) {
                alert('Erro ao deletar o cliente.');
            }
        }
    };

    if (loading) return <div>Carregando clientes...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>👤 Cadastro de Clientes</h2>

            {/* Formulário de Criação/Edição */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h4>{clienteEditando.id ? 'Editar Cliente' : 'Novo Cliente'}</h4>
                <input name="nome" value={clienteEditando.nome} onChange={handleChange} placeholder="Nome" required />
                <input name="telefone" value={clienteEditando.telefone} onChange={handleChange} placeholder="Telefone" />
                <input name="email" value={clienteEditando.email} onChange={handleChange} placeholder="Email" type="email" />
                <br />
                <button type="submit">Salvar Cliente</button>
                {clienteEditando.id && (
                    <button type="button" onClick={() => setClienteEditando(ClienteFormVazio)} style={{ marginLeft: '10px' }}>
                        Cancelar Edição
                    </button>
                )}
            </form>

            {/* Lista de Clientes */}
            <h3>Clientes Cadastrados</h3>
            <table>
                <thead>
                    <tr><th>ID</th><th>Nome</th><th>Telefone</th><th>Email</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nome}</td>
                            <td>{cliente.telefone}</td>
                            <td>{cliente.email}</td>
                            <td>
                                <button onClick={() => handleEdit(cliente)}>Editar</button>
                                <button onClick={() => handleDelete(cliente.id)} style={{ marginLeft: '5px' }}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Clientes;