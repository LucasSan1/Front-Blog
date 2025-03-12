import React, { useContext } from "react"; 
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/auth";

import Login from './views/Login';
import Main from "./views/MainPage";
import Cadastro from "./views/Cadastro";
import AtualizarSenha from "./views/AtualizarSenha";

const AppRotas = () => {

    const Private = ({children}) => {
      
        const { authenticated, carregando } = useContext(AuthContext);

      
        if(carregando) {
            return(<div className="carregando"><h2>Carregando....</h2></div>);
        }
        if(!authenticated) {
            return(
                <Navigate to="/login" />
            );
        }    
        return(children);
    };
   
    
    return(
        <BrowserRouter>
            <AuthProvider>
            <Routes>
                <Route path="/login" element={ <Login /> }/>
                <Route path="/cadastro" element={ <Cadastro/> }/>
                <Route path="atualizarSenha" element={ <AtualizarSenha/> }/>
                    
                <Route path="/" element={<Main />} >
                </Route>
            </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default AppRotas;