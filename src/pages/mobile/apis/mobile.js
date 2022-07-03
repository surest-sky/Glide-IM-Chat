import { axiosInstance as request } from './axios';

// 登录
export function guestLogin(data = {}) {
    return request({
        url: '/auth/guestV2',
        method: 'post',
        data,
    });
}

// 分配联系人
export function getToUid(data = {}) {
    return request({
        url: '/app/guest-id',
        method: 'post',
        data,
    });
}