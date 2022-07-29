import request from '../request';

export function getContactsList() {
    return request({
        url: '/contacts/list',
        method: 'post'
    });
}

export function addContact(params) {
    return request({
        url: '/contacts/add',
        method: 'post',
        data: params
    });
}