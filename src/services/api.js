import axios from "axios";

export const api = axios.create({
    // baseURL: 'http://localhost:8080' // Mudar para url da api
    baseURL: `https://graceful-corly-sant422-5dd649ae.koyeb.app/`
});
