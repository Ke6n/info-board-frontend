import axios from 'axios';

const baseURL = '/api';
const instance = axios.create({baseURL})


//response interceptor
instance.interceptors.response.use(
    result=>{
        return result.data;
    },
    err=>{
        alert('Service exception');
        return Promise.reject(err);
    }
)

export default instance;