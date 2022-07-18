import request from '../request';

export function getChatHistory(data = {}) {
    return request({
        url: '/msg/chat/history',
        method: 'post',
        data,
    });
}