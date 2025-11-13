import React, { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Swal from "sweetalert2"; 
import Cookies from 'js-cookie';

// Define o contexto
export const AuthContext = createContext();

// Define o contexto que faz a validação dos dados
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [carregando, setCarregando] = useState(true);

    // Função que recebe o usuario e o token da API e salva esses dados
    const login = (usuario, token) => {
        if (usuario === undefined || token === undefined) {
            Swal.fire("Erro", "Não autenticado", "error");
        } else {
            Cookies.set('Authorization', `Bearer ${token}`, {
                expires: 0.5, // 0.5 dia = 12 horas
                secure: true,
                sameSite: 'Lax',
            });

            Cookies.set('user', JSON.stringify(usuario), {
                expires: 0.5, // 12 horas também
                sameSite: 'Lax',
            });
         
            setUser(usuario);

            Swal.fire("Sucesso", "Login realizado com sucesso!", "success");
            navigate("/");
        }
    };

    // Função para logout do usuário e limpeza dos dados no localStorage
    const logout = () => {
        api.post("/user/logout", {}, {
            headers: {
                Authorization: localStorage.getItem('Authorization')
            }
        })
        .then((res) => {
            Swal.fire("Sucesso", "Logout realizado", "success").then(() => {
                Cookies.remove('Authorization');
                Cookies.remove('user');
                  
                setUser(null);
               
                window.location.reload();
            });
        })
        .catch((err) => {
            Swal.fire("Erro", "Erro ao realizar logout: " + err, "error");
            console.log(err);
        });
    };

    // Antes da página ser renderizada, verifica se o usúario ainda esta logado no localStorage
    useEffect(() => {
        const usuarioRecuperado = Cookies.get("user");
        const tokenRecuperado = Cookies.get('Authorization');

        if (usuarioRecuperado && tokenRecuperado) {
            setUser(JSON.parse(usuarioRecuperado));
        }

        setCarregando(false);
    }, []);

    // Exporta os valores/variáveis para todo o sistema
    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, carregando, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
