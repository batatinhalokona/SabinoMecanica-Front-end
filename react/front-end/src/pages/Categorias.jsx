// src/pages/Categorias.jsx
import React, { useState, useEffect } from 'react';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../api/CategoriaApi';

// Define o estado inicial do formulário de categoria
const CategoriaVazia = {
    id: null,
    descricao: '',
};

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [categoriaEditando, setCategoriaEditando] = useState(CategoriaVazia);
    const [loading, setLoading] = useState(true);

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const data = await getCategorias();
            setCategorias(data);
        } catch (error) {
            alert('Não foi possível carregar as categorias. Verifique o backend.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    // Atualiza o estado da descrição no formulário
    const handleChange = (e) => {
        setCategoriaEditando(prev => ({ ...prev, descricao: e.target.value }));
    };

    // Lida com a submissão (Criação ou Edição)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoriaEditando.descricao) return;

        try {
            if (categoriaEditando.id) {
                // Se tem ID, chama UPDATE
                await updateCategoria(categoriaEditando);
            } else {
                // Se não tem ID, chama CREATE
                await createCategoria(categoriaEditando);
            }
            
            // Limpa o formulário e recarrega a lista
            setCategoriaEditando(CategoriaVazia); 
            fetchCategorias(); 
        } catch (error) {
            alert(`Erro ao salvar categoria: ${error.response?.data || error.message}`);
        }
    };

    // Preenche o formulário para edição
    const handleEdit = (categoria) => {
        setCategoriaEditando(categoria);
    };

    // Lida com a exclusão
    const handleDelete = async (id) => {
        if (!window.confirm(`Tem certeza que deseja deletar a categoria ID ${id}?`)) {
            return;
        }
        try {
            await deleteCategoria(id);
            // Filtra a lista localmente (mais rápido que recarregar tudo)
            setCategorias(categorias.filter(cat => cat.id !== id));
        } catch (error) {
            alert('Erro ao deletar categoria. Pode haver serviços ou despesas vinculadas.');
        }
    };

    if (loading) {
        return <div>Carregando categorias...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>🛠️ Gerenciar Categorias</h2>
            
            {/* Formulário de Cadastro/Edição */}
            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
                <h4>{categoriaEditando.id ? `Editar Categoria #${categoriaEditando.id}` : 'Nova Categoria'}</h4>
                <input
                    type="text"
                    placeholder="Descrição da Categoria (Ex: Revisão, Peças)"
                    value={categoriaEditando.descricao}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Salvar</button>
                
                {categoriaEditando.id && (
                    <button type="button" onClick={() => setCategoriaEditando(CategoriaVazia)} style={{ marginLeft: '10px' }}>
                        Cancelar Edição
                    </button>
                )}
            </form>

            {/* Lista de Categorias */}
            <h3>Categorias Existentes ({categorias.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd', width: '50px' }}>ID</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Descrição</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', width: '150px' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map(categoria => (
                        <tr key={categoria.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{categoria.id}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{categoria.descricao}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <button onClick={() => handleEdit(categoria)}>Editar</button>
                                <button 
                                    onClick={() => handleDelete(categoria.id)}
                                    style={{ marginLeft: '5px', backgroundColor: 'red', color: 'white' }}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Categorias;