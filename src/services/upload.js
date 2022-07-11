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
    return Promise.resolve(host + rf)
};



export const uploadDomFile = (accept = 'image/*', name, callback) => {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', accept);
    input.setAttribute('class', 'hidden');
    document.body.appendChild(input);
    input.onchange = async function () {
        var file = this.files[0];
        const address = await uploadFile(file, name)
        callback && callback(address);
    };
    input.click();
}


export const loadFileBob = file => {
    let base64,
        reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = async function (e) {
            base64 = e.target.result;
            var arr = base64.split(','),
                mime = arr[0].match(/:(.*?);/)[1];
            resolve({ base64, fileType: mime });
        };
        reader.readAsDataURL(file);
    });
};