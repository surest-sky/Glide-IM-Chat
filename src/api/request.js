import { Message } from '@arco-design/web-react';
import axios from 'axios';
import { getAuthInfo, setLogout } from 'src/services/auth';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// create an axios instance
const service = axios.create({
    baseURL: BASE_URL,
    timeout: 4000 * 60, // request timeout
});

const responseCodeHandle = (r) => {
    return Promise.resolve(r);
};

// request interceptor
service.interceptors.request.use(
    async config => {
        const authInfo = getAuthInfo();
        const token = authInfo?.token;
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        config.headers['Host-A'] = window.location.host;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    response => {
        console.log('response', response)
        return responseCodeHandle(response);
    },
    error => {
        try {
            const { status } = error.response
            if (status === 401) {
                setLogout()
                window.location.href = "/login"
            }
        } catch (error) {
            Message.error("网络错误，请重试")
        }
        return Promise.resolve({});
    }
);

export default service;
