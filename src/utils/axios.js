// src/utils/axios.js
import axios from 'axios';

// Membuat instance axios dengan konfigurasi dasar
const instance = axios.create({
    baseURL: 'https://ac.igm.biz.id/api', // Ganti dengan base URL API Anda
    headers: {
        'Content-Type': 'application/json',
    },
});

// Menambahkan interceptor untuk menyertakan api_token jika ada
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('api_token'); // Ambil token dari localStorage atau metode penyimpanan lain yang Anda gunakan
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.log(error, 'disini error')
    return Promise.reject(error);
});

instance.interceptors.response.use((config) => {
    console.log(config)
    return config;
}, (error) => {
    if (error && error.response && error.response.status && error.response.status === 401) {
        console.log('User tidak autentik')
        localStorage.clear();
        if( location.pathname !== '/login' ){
            location.replace('/login')
        }
    }
    return Promise.reject(error);
});

export default instance;
