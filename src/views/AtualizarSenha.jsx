import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Swal from "sweetalert2";

const AtualizarSenha = () => {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    const enviar = (e) => {
        e.preventDefault(); 

        api.put('/user/forgetPass', {
            email: usuario,
            password: senha
        })
        .then((res) => {
            Swal.fire({
                title: "Sucesso!",
                text: res.data,
                icon: "success",
                confirmButtonText: "OK"
            });
            navigate("/login")
        })
        .catch((err) => {
            console.log(err);
            
            if(err.response?.status === 404){
                Swal.fire("Erro", err.response.data, "error");
            } else {
                Swal.fire("Erro", "Erro ao atualizar senha. Tente novamente.", "error");
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center bg-[#F4F4F4] min-h-screen px-8">
            <div className="bg-white max-w-md w-full p-6 shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-[#333333] text-center mb-6">Esqueci minha senha</h1>
                <form onSubmit={enviar}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-lg italic text-[#333333]">Usuário:</label>
                        <input
                            name="email"
                            type="text"
                            id="email"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="w-full h-7 border border-[#007BFF] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="senha" className="block text-lg italic text-[#333333]">Nova senha:</label>
                        <input
                            name="senha"
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full h-7 border border-[#007BFF] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button type="submit" className="bg-[#FF6F61] text-white text-lg py-2 px-6 rounded-lg hover:scale-105 transition-transform duration-200">Atualizar</button>
                        <Link to="/login" className="text-[#333333] text-sm mt-2 hover:text-[#FF6F61] hover:scale-105 transition-transform duration-200">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AtualizarSenha;
