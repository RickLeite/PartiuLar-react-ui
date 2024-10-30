// lib/apiRequest.js
import axios from "axios";

const apiRequest = axios.create({
    baseURL: "http://localhost:8800/api",
    withCredentials: true,
});

// Interceptador para adicionar o token em todas as requisições
apiRequest.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const parsedUser = JSON.parse(user);
            // Adiciona o token no header de autorização
            if (parsedUser?.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`;
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptador para lidar com respostas
apiRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Limpa o localStorage e redireciona para login
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiRequest;