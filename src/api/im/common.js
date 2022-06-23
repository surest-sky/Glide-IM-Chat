import { axiosInstance as request } from '../axios';

export function getQiniuToken(data = {}) {
    return request({
        url: '/tool/get-qiniu-token',
        method: 'post',
        data,
    });
}