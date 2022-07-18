import request from '../request';

export function getQiniuToken(data = {}) {
    return request({
        url: '/tool/get-qiniu-token',
        method: 'post',
        data,
    });
}