import axios from 'axios';
import { getAuthInfo } from 'src/services/auth';
import { setLogout } from 'src/services/auth'

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
        const token = authInfo?.Token;
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
        const { status } = error.response
        if (status === 401) {
            setLogout()
            // 重新登录
            window.location.href = "/m?login=1"
        }
        return Promise.resolve({});
    }
);

export default service;
