import axios from 'axios';
const baseUri = process.env.REACT_APP_API_URL;

const uploadApi = data => {
    console.log(baseUri);
    const request = axios.create({
        baseURL: baseUri,
    });
    return request({
        url: '/api/upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data,
    });
};

export const UploadFile = data => {
    var formData = new FormData();
    formData.append('file', data);
    formData.append('name', `${new Date().getTime()}.png`);
    return uploadApi(formData);
};
