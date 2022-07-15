import { axiosInstance as request } from '../axios';

export function updateApp(id, data = {}) {
    return request({
        url: `/app/${id}`,
        method: 'post',
        data,
    });
}


export function forgetPassword(data = {}) {
    return request({
        url: `/auth/forget`,
        method: 'post',
        data,
    });
}

export function register(data = {}) {
    return request({
        url: `/auth/register`,
        method: 'post',
        data,
    });
}


