import request from '../request';

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


export function updateAppHost(data = {}) {
    return request({
        url: `/app/host`,
        method: 'post',
        data,
    });
}



