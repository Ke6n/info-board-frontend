import axios from 'axios';
import { ElMessage } from 'element-plus'

const baseURL = '/api';
const instance = axios.create({ baseURL })

import { useTokenStore } from '@/stores/token.js';
//request interceptor
instance.interceptors.request.use(
    (config) => {
        const tokenStore = useTokenStore();
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err) => {
        Promise.reject(err);
    }
)

import router from '@/router';

//response interceptor
instance.interceptors.response.use(
    result => {
        if (result.data.code === 0) {
            return result.data;
        }
        ElMessage.error(result.data.msg ? result.data.msg : 'Service exception')
        return Promise.reject(result.data);
    },
    err => {
        if (err.response.status === 401) {
            ElMessage.error('Please log in first')
            router.push('/login')
        } else {
            ElMessage.error('Service exception');
        }
        return Promise.reject(err);
    }
)

export default instance;