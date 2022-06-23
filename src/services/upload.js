import { getQiniuToken } from 'src/api/im/common'
import axios from 'axios'

const uploadApi = async (data, baseUri) => {
    const request = axios.create({
        baseURL: baseUri,
    });
    return request({
        url: '',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data,
    });
};

export const uploadFile = async (data, name) => {
    const { data: { Data } } = await getQiniuToken()
    const { token, upload_dir, url, host } = Data

    const filename = [upload_dir, name].join('/')
    var formData = new FormData();
    formData.append('file', data, filename)
    formData.append('token', token);
    const result = await uploadApi(formData, url);
    const rf = result.data.key
    console.log('host + rf', host + rf)
    return Promise.resolve(host + rf)
};
