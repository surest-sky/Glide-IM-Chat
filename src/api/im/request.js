import axios from 'axios';
import { getLoginToken } from '../services/auth';


// create an axios instance
const service = axios.create({
    timeout: 3000,
    baseURL: process.env.REACT_APP_BASE_URL || 'https://api.t.glide-im.pro/api/',
});


// request interceptor
service.interceptors.request.use(
    async config => {
        // let token = getLoginToken();
        // if (token) {
        //     config.headers.Authorization = 'Bearer ' + token;
        // }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;
