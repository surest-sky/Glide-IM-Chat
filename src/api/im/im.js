import { axiosInstance as request } from '../axios';

export function addContactsApi(data) {
    return request({
        url: '/contacts/add',
        method: 'post',
        data,
    });
}
