import request from '../request';

export function getContactsList() {
    return request({
        url: '/contacts/list',
        method: 'post'
    });
}

export function addContact(uid) {
    return request({
        url: '/contacts/add',
        method: 'post',
        params: { Uid: uid }
    });
}