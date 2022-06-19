import { db } from './db';
import { Message } from 'src/core/message';
import { ContactsType } from 'src/core/chat_type';
import store from 'src/store/index';
import { orderBy } from 'lodash';
import { MessageType } from 'src/core/message';

const isRoomMessage = (message: Message): boolean => {
    const currentUser = store.getState().container.userInfo;
    const chatWithUser = store.getState().chat.chatWithUser;

    console.log(chatWithUser.uid, currentUser.Uid);

    // 我发给对方
    if (message.to === chatWithUser.uid && message.from === parseInt(currentUser.Uid)) {
        return true;
    }

    // 对方发给我
    if (message.to === parseInt(currentUser.Uid) && message.from === chatWithUser.uid) {
        return true;
    }
    return false;
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

// 给联系人添加一条消息提醒
export const incrContactsMessageCount = (uid: number) => {
    db.contacts.where({ uid }).modify(f => ++f.message_count);
};

// 添加一条消息
export const addMessage = (message: Message) => {
    if (isRoomMessage(message)) {
        addRoomMessages(message);
    } else {
        incrContactsMessageCount(message.from);
    }
    db.chat.add(message);
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
    return db.chat.where({ from: from, to: to }).toArray();
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
        console.log(orderBy(_messages, 'sendAt'));
        addBlukRoomMessages(orderBy(_messages, 'sendAt'));
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
