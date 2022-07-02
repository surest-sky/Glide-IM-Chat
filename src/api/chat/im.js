import { axiosInstance as request } from '../axios';
import { map } from 'lodash';

export function addContactsApi(data) {
    return request({
        url: '/contacts/add',
        method: 'post',
        data,
    });
}


export function getContactsListApi(data) {
    return request({
        url: '/contacts/list',
        method: 'post',
        data,
    });
}


export function registerUserApi(data) {
    return request({
        url: '/auth/register',
        method: 'post',
        data,
    });
}


export function loginUserApi(data) {
    return request({
        url: '/auth/signin',
        method: 'post',
        data,
    });
}

export function userInfoApi(data) {
    console.log('userInfoApi', data)
    return request({
        url: '/user/info',
        method: 'post',
        data,
    });
}

export function userAuthApi(data) {
    return request({
        url: '/auth/token',
        method: 'post',
        data,
    });
}

// 联系人数据补齐
const contactsUsers = async (Uids: Array<string>) => {
    try {
        const {
            data: { Data },
        } = await userInfoApi({ Uid: Uids });
        return Data;
    } catch (error) {
        return [];
    }
};

// 获取联系人列表
export async function getContacts() {
    try {
        const {
            data: { Data },
        } = await getContactsListApi();
        const uids = map(Data, 'Id');
        let contactsList = await contactsUsers(uids);
        contactsList = contactsList.map(contacts => {
            return {
                avatar: undefined,
                name: contacts.Nickname,
                uid: contacts.Uid,
                message_count: 0
            };
        });
        return contactsList
    } catch (error) {
        return []
    }
}