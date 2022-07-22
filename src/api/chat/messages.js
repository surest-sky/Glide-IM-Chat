import request from '../request';

export function getMessagelist(data) {
    return request({
        url: '/message/list',
        method: 'post',
        data
    });
}

export function setMessageRead(data) {
    return request({
        url: '/message/read',
        method: 'post',
        data
    });
}


export function recallMessage(data) {
    return request({
        url: '/message/recall',
        method: 'post',
        data
    });
}