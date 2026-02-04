import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // Cambia esto si el backend está en otro lugar
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;