import request from './axios';

// 登录
export function guestLogin(data = {}) {
    return request({
        url: '/auth/guest/signin',
        method: 'post',
        data,
    });
}

// 分配联系人
export function getToUid(data = {}) {
    return request({
        url: '/guest/guest-id',
        method: 'post',
        data,
    });
}