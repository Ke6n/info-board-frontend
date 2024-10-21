import axios from 'axios';
import { ElMessage } from 'element-plus'

const baseURL = '/api';
const instance = axios.create({baseURL})


//response interceptor
instance.interceptors.response.use(
    result=>{
        if(result.data.code===0){
            return result.data;
        }
        ElMessage.error(result.data.msg?result.data.msg:'Service exception')
        return Promise.reject(result.data);
    },
    err=>{
        alert('Service exception');
        return Promise.reject(err);
    }
)

export default instance;