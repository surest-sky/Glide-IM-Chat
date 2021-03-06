import { get } from 'lodash';
import { getSessionGet } from 'src/api/chat/chat';
import { userInfoApi } from 'src/api/im/im';
import { ContactsType } from 'src/core/chat_type';
import { Message, MessageType } from 'src/core/message';
import { addContactUserMessage } from 'src/services/store';
import store from 'src/store/index';
import { db } from './db';
import { getSessionId, readMessages } from './message';

const isRoomMessage = (message): boolean => {
    if (message.isMe) {
        return true;
    }

    const chatWithUser = store.getState().chat.chatWithUser;
    if (parseInt(message.from) === chatWithUser.uid) {
        return true;
    }
    return false;
    // const currentUser = store.getState().container.authInfo;
    // const currentUserUid = chatWithUser.uid;
    // const chatWithUserUid = parseInt(currentUser.uid);
    // const session_id = getSessionId(currentUserUid, chatWithUserUid);
    // if (message.session_id === session_id) {
    //     return true;
    // }
    // return false;
};

// 是否为新的联系人
export const isNewContact = async from => {
    const item = await db.contacts.where({ uid: parseInt(from) }).first();
    if (item) {
        return false;
    }
    return true;
};

// 添加联系人
export const addContactInfo = async (message, from) => {
    const { data } = await userInfoApi({ uid: [from] });
    const Data = get(data, 'Data.0');
    const contacts: ContactsType = {
        avatar: Data.avatar,
        name: Data.nick_name,
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
    const currentUser = store.getState().container.authInfo;
    readMessages(parseInt(currentUser.uid), uid);
    db.contacts.where({ uid }).modify(f => (f.message_count = 0));
};

// 给联系人添加一条未读消息提醒
export const incrContactsMessageCount = (uid: number) => {
    db.contacts.where({ uid }).modify(f => ++f.message_count);
};

// 添加一条消息
export const addMessage = async (message: Message) => {
    console.log('收到一条消息', message);
    const to = parseInt(message.to);
    const from = parseInt(message.from);
    const _message: any = Object.assign({}, message, {
        from: from,
        to: to,
    });
    const isNew = await isNewContact(from);
    if (isNew) {
        await addContactInfo(message, from);
    }
    _message.session_id = getSessionId(from, to);
    if (!isRoomMessage(_message)) {
        incrContactsMessageCount(from);
    }
    addContactUserMessage(message);
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
    // db.activeChat.add(message);
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
    const session_id = getSessionId(from, to);
    const messages = await db.chat.where({ session_id }).first();
    return messages;
};

export const switchRoom = async (from: number, to: number) => {
    clearContactsMessageCount(to);
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
