import { axiosInstance as request } from '../axios';

export function getChatHistory(data = {}) {
    return request({
        url: '/msg/chat/history',
        method: 'post',
        data,
    });
}

// 获取会话列表
export function getSessionRecent(data = {}) {
    return request({
        url: '/session/recent',
        method: 'post',
        data,
    });
}