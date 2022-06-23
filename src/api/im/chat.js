import { axiosInstance as request } from '../axios';

export function getChatHistory(data = {}) {
    return request({
        url: '/msg/chat/history',
        method: 'post',
        data,
    });
}