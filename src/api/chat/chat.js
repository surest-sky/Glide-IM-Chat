import request from '../request';

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

// 添加到会话列表中
export function getSessionGet(data = {}) {
    return request({
        url: '/session/get',
        method: 'post',
        data,
    });
}

// 添加到会话列表中
export function setCategoryForUser(id, data) {
    return request({
        url: '/category/user/' + id,
        method: 'post',
        data,
    });
}
