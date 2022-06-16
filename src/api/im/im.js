import { axiosInstance as request } from '../axios';

export function addContactsApi(data) {
    return request({
        url: '/contacts/add',
        method: 'post',
        data,
    });
}


export function getContactsListApi(data) {
    return request({
        url: '/contacts/list',
        method: 'post',
        data,
    });
}


export function registerUserApi(data) {
    return request({
        url: '/auth/register',
        method: 'post',
        data,
    });
}


export function loginUserApi(data) {
    return request({
        url: '/auth/signin',
        method: 'post',
        data,
    });
}

export function userInfoApi(data) {
    return request({
        url: '/user/info',
        method: 'post',
        data,
    });
}

export function userAuthApi(data) {
    return request({
        url: '/auth/token',
        method: 'post',
        data,
    });
}
