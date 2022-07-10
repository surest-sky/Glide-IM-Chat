import { db } from './db';
import { Message } from 'src/core/message';
import { ContactsType } from 'src/core/chat_type';
import store from 'src/store/index';
import { orderBy, get } from 'lodash';
import { MessageType } from 'src/core/message';
import { addContactUserMessage } from 'src/services/store';
import { userInfoApi } from 'src/api/im/im';
import { getSessionGet } from 'src/api/chat/chat';

const isRoomMessage = (message): boolean => {
    const currentUser = store.getState().container.userInfo;
    const chatWithUser = store.getState().chat.chatWithUser;
    const currentUserUid = chatWithUser.uid;
    const chatWithUserUid = currentUser.Uid;
    // 我发给对方
    if (message.to === chatWithUserUid && message.from === currentUserUid) {
        return true;
    }

    // 对方发给我
    if (message.to === currentUserUid && message.from === chatWithUserUid) {
        return true;
    }
    return false;
};

// 是否为新的联系人
export const isNewContact = async from => {
    const item = await db.contacts.where({ uid: parseInt(from) }).first();
    console.log('item', item, parseInt(from));
    if (item) {
        return false;
    }
    return true;
};

// 添加联系人
export const addContactInfo = async (message, from) => {
    const { data } = await userInfoApi({ Uid: [from] });
    const Data = get(data, 'Data.0');
    const contacts: ContactsType = {
        avatar: Data.avatar,
        name: Data.Nickname,
        message_count: 0,
        uid: from,
        motto: '',
        lastMessage: message,
    };
    addContacts(contacts);
    getSessionGet({ to: from });
};

// 获取一个联系人
export const getContacts = () => {
    return db.contacts.toArray();
};

// 添加一个联系人
export const addContacts = (contacts: ContactsType) => {
    db.contacts.add(contacts);
};

// 移除一个联系人
export const removeContacts = (contacts: ContactsType) => {
    db.contacts.add(contacts);
};

// 添加多个联系人
export const addBlukContacts = (contactsList: ContactsType[]) => {
    db.contacts.clear();
    db.contacts.bulkAdd(contactsList);
};

// 移除联系人
export const removeContact = (uid: number) => {
    db.contacts.where({ uid }).delete();
};

// 给联系人移除一条消息提醒
export const decrContactsMessageCount = (uid: number) => {
    db.contacts.where({ uid }).modify(f => --f.message_count);
};

// 给联系人清空消息提醒
export const clearContactsMessageCount = (uid: number) => {
    console.log('uid', 'clearContactsMessageCount', uid);
    db.contacts.where({ uid }).modify(f => (f.message_count = 0));
};

// 给联系人添加一条未读消息提醒
export const incrContactsMessageCount = (uid: number) => {
    db.contacts.where({ uid }).modify(f => ++f.message_count);
};

// 添加一条消息
export const addMessage = async (message: Message) => {
    const to = parseInt(message.to);
    const from = parseInt(message.from);
    const _message = Object.assign({}, message, {
        from: from,
        to: to,
    });
    const isNew = await isNewContact(from);
    // isM
    if (isNew) {
        await addContactInfo(message, from);
        incrContactsMessageCount(from);
        addContactUserMessage(message);
        db.chat.add(_message);
        return;
    }

    if (isRoomMessage(_message)) {
        addRoomMessages(_message);
        addContactUserMessage(message);
    } else {
        incrContactsMessageCount(from);
        addContactUserMessage(message);
    }
    db.chat.add(_message);
};

// 添加多条消息
export const addMessages = (message: Message[]) => {
    db.chat.bulkAdd(message);
};

// 消息撤回
export const withdrawMessage = (message: Message) => {
    if (isRoomMessage(message)) {
        withdrawRoomMessage(message);
    }
    db.chat.where({ mid: message.mid }).modify(f => (f.type = MessageType.Recall));
};

// 移除某一条消息 | 只是针对当前窗口移除 | 不等于撤回双方消息
export const removeMessage = (message: Message) => {
    if (isRoomMessage(message)) {
        removeRoomMessage(message);
    }
    db.chat.where({ mid: message.mid }).delete();
};

// 当前房间中的所有消息
export const activeRoomMessages = () => {
    return db.contacts.orderBy('sendAt').toArray();
};

// 给当前活动的房间内添加一条消息
export const addRoomMessages = (message: Message) => {
    db.activeChat.add(message);
};

// 移除某一条消息 | 只是针对当前窗口移除 | 不等于撤回双方消息
export const removeRoomMessage = (message: Message) => {
    db.activeChat.where({ mid: message.mid }).delete();
};

// 房间内撤回双方消息
export const withdrawRoomMessage = (message: Message) => {
    db.activeChat.where({ mid: message.mid }).modify(f => (f.type = MessageType.Recall));
};

// 给当前活动的房间内添加一条消息
export const addBlukRoomMessages = (messageList: Message[]) => {
    db.activeChat.bulkAdd(messageList);
};

// 清除当前房间内的消息
export const clearRoomMessages = () => {
    db.activeChat.clear();
};

// 获取与某人的消息
export const getMessagesByOne = (from: number, to: number) => {
    console.log(from, to);
    return db.chat.where({ from: from, to: to }).toArray();
};

// 获取与某人的最后一条消息
export const getMessagesByOnelastMessage = async (from: number, to: number) => {
    if (!from || !to) {
        return '';
    }
    console.log('to', to);
    const f1 = await db.chat.where({ from: from, to: to }).last();
    const f2 = await db.chat.where({ from: to, to: from }).last();
    if (f1 && f2) {
        if (f1.sendAt > f2.sendAt) {
            return f1;
        }
        return f2;
    }

    return f1 || f2;
};

export const switchRoom = async (from: number, to: number) => {
    clearRoomMessages();
    Promise.all([getMessagesByOne(from, to), getMessagesByOne(to, from)]).then(messages => {
        const _messages = [];
        messages.forEach(ms => {
            ms.forEach(message => {
                _messages.push(message);
            });
        });
        console.log('orderBy', orderBy(_messages, 'sendAt'));
        clearRoomMessages();
        addBlukRoomMessages(orderBy(_messages, 'sendAt'));
        clearContactsMessageCount(to);
    });
};

// 消息移除
export const removeMessages = (from: number, to: number) => {
    db.chat.where({ from: from, to: to }).delete();
    db.activeChat.where({ from: from, to: to }).delete();

    db.chat.where({ from: to, to: from }).delete();
    db.activeChat.where({ from: to, to: from }).delete();
};

// 消息已读
export const readRoomMessage = () => {};

// 消息发送中 pending
export const sendPendingRoomMessage = () => {};

// 消息发送成功 success
export const sendSuccessRoomMessage = () => {};

// 针对消息的某些动作分发
export const actionMessage = () => {};
