import request from './request';

export function loginApi(data) {
    return request({
        url: '/api/login',
        method: 'post',
        data,
    });
}

export function registerApi(data) {
    return request({
        url: '/api/auth/register',
        method: 'post',
        data,
    });
}

export function getUserApi() {
    return request({
        url: '/user/info',
        method: 'post',
    });
}

export function verifyCode(data) {
    return request({
        url: '/api/auth/captcha',
        method: 'post',
        data,
    });
}

export function addContactsApi(data) {
    return request({
        url: '/contacts/add',
        method: 'post',
        data,
    });
}

export function authLoginApi(data) {
    return request({
        url: '/auth/signin',
        method: 'post',
        data,
    });
}

export function authRegisterApi(data) {
    return request({
        url: '/auth/register',
        method: 'post',
        data,
    });
}
