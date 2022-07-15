import { axiosInstance as request } from '../axios';

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