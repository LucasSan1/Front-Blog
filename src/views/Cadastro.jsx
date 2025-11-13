import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Swal from "sweetalert2";

const CadastrarPage = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [usuario, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // Expressão para validar o formato do usuário
    const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const enviar = async () => {
        if (nome.trim() === "" || usuario.trim() === "" || senha.trim() === "") {
            Swal.fire("Campos Obrigatorios", "Por favor, preencha todos os campos.", "warning");
        } else if (!emailValidation.test(usuario)) {
            Swal.fire("Email invalido", "Por favor, insira um Email válido.", "warning");
        } else {
            try {
                await api.post('/user', { 
                    name: nome, 
                    email: usuario,
                    password: senha
                });  
                Swal.fire({
                    title: "Sucesso!",
                    text: "Cadastro realizado com sucesso!",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate('/login');
                });
            } catch (error) {
                console.log(error)
                if (error.response && error.response.status === 400) {
                    Swal.fire("Erro", error.response.data, "error");
                    return;
                }
                Swal.fire("Erro", "Erro ao cadastrar. Tente novamente.", "error");
                
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastrar-se</h1>
                <form>
                  
                    <div className="mb-4">
                        <label htmlFor="nome" className="block text-gray-700 font-medium">Nome:</label>
                        <input 
                            name="nome" 
                            type="text" 
                            id="nome" 
                            required 
                            value={nome} 
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium">Email:</label>
                        <input 
                            name="email" 
                            type="email" 
                            id="email" 
                            required 
                            value={usuario} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="senha" className="block text-gray-700 font-medium">Senha:</label>
                        <input 
                            name="senha" 
                            type="password" 
                            id="senha" 
                            required 
                            value={senha} 
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <button 
                            type="button" 
                            onClick={enviar} 
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Cadastrar-se
                        </button>
                        <Link 
                            to="/login" 
                            className="text-center text-blue-500 hover:underline"
                        >
                            Já tem uma conta? Faça login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CadastrarPage;
