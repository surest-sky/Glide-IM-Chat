import axios from 'axios';
import { getLoginInfo } from '../services/auth';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://api.t.glide-im.pro/api/';

const service = axios.create({
    baseURL: BASE_URL,
    timeout: 4000 * 60,
});


service.interceptors.request.use(
    async config => {
        const authInfo = getLoginInfo()
        if (authInfo.token) {
            config.headers.Authorization = 'Bearer ' + authInfo.token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        const { Code, Msg, Data } = response
        if (Code !== 100) {
            return Promise.reject(Msg);
        }
        return Promise.resolve(Code, Msg, Data);
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;
