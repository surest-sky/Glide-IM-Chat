import { axiosInstance as request } from '../axios';

export function getCategoryList(data) {
    return request({
        url: '/category/list',
        method: 'get',
        params: data,
    });
}


export function updateCategoryApi(data) {
    return request({
        url: '/category/updates',
        method: 'post',
        data,
    });
}


export function deleteCategoryApi(id) {
    return request({
        url: '/category/delete/' + id,
        method: 'delete',
    });
}