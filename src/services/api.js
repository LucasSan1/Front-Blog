import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:8080' // Mudar para url da api
    // baseURL: `https://decent-gerladina-lucassan1-2434bea0.koyeb.app/`
});
