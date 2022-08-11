import request from '../request';

export function getQiniuToken(data = {}) {
    return request({
        url: '/tool/get-qiniu-token',
        method: 'post',
        data,
    });
}

export function sendCaptcha(data) {
    return request({
        url: '/auth/verifyCode',
        method: 'post',
        data,
    });
}

export function getLiveRoomToken(data) {
    return request({
        url: '/cs/live-room',
        method: 'post',
        data,
    });
}
