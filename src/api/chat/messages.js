import request from '../request';

export function getMessagelist(data) {
    return request({
        url: '/message/list',
        method: 'post',
        data
    });
}
