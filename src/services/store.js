

import { get } from 'lodash';
import { addBlukContacts, getContacts } from 'src/services/chat_db';
import { uploadFile } from 'src/services/upload';
import { getAuthInfo } from 'src/services/auth';

// 给联系人添加一条消息
export const addContactUserMessage = async (message) => {
    const userInfo = getAuthInfo()
    const contacts = await getContacts()
    let _contacts = contacts.map(item => {
        console.log('item', item)
        const iuid = item.uid.toString()
        if (userInfo.Uid === item.uid) {
            if (!message.isMeToo) {
                return item
            }
        }
        item.weight = 0
        if (message.from === iuid) {
            item.lastMessage = message
            item.weight = message.SendAt;
        }
        if (message.to === iuid) {
            item.lastMessage = message
            item.weight = message.SendAt;
        }
        return item;
    });
    addBlukContacts(_contacts)
}

/**
 * 粘贴板图片处理
 * @param {*} event
 * @returns
 */
export const pasteImage = (event): string => {
    let file,
        items = event.clipboardData.items;
    if (!items) {
        return Promise.resolve(false);
    }

    // 检测剪贴板是否包含图片
    if (items && items.length) {
        const type = get(items, '[0].type');
        if (type !== -1) {
            file = get(items, '0').getAsFile();
            if (!file) {
                return Promise.resolve(false);
            }
        }
    }

    let base64,
        reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = async function (e) {
            base64 = e.target.result;
            resolve(base64);
        };
        reader.readAsDataURL(file);
    });
};

/** 上传 Base64 图片 */
export const uploadBase64File = async base64 => {
    var arr = base64.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    const base64File = new Blob([u8arr], { type: mime });
    const rand = new Date().getTime()
    const url = await uploadFile(base64File, `${rand}.png`);
    return Promise.resolve(url);
};
