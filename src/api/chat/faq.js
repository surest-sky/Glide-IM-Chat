import request from '../request';

export function addArticle(data) {
    return request({
        url: '/articles/store',
        method: 'post',
        data,
    });
}

export function updateArticle(id, data) {
    return request({
        url: '/articles/' + id,
        method: 'post',
        data,
    });
}

export function getArticleList(params) {
    return request({
        url: '/articles/list',
        method: 'get',
        params,
    });
}

export function delArticle(id) {
    return request({
        url: '/articles/delete/' + id,
        method: 'delete',
    });
}

export function getArticle(id) {
    return request({
        url: '/articles/show/' + id,
        method: 'get',
    });
}
