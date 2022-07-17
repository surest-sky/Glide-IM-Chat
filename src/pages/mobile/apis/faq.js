import request from './axios';

// 文章列表
export function getArticleList() {
    return request({
        url: '/guest/articles/list',
        method: 'get',
    });
}

// 文章详情
export function getArticleShow(id) {
    return request({
        url: `/guest/articles/${id}`,
        method: 'get'
    });
}