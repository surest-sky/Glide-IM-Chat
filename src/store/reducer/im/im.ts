import { createSlice } from '@reduxjs/toolkit';
import { ContactsType } from 'src/core/chat_type';

export interface ChatState {
    chatWithUser: ContactsType;
    contactsList: ContactsType[];
}

const initialState: ChatState = {
    chatWithUser: {
        avatar: '',
        name: '',
        message: '',
        uid: 0,
        motto: '',
    },
    contactsList: [],
};

const chatReducers = {
    updateChatWithUser: (state, { payload }) => {
        console.log(payload);
        state.chatWithUser = payload.chatWithUser;
    },

    // 添加一个联系人
    addContacts: (state, { payload }) => {},

    // 移除联系人
    removeContact: (state, { payload }) => {},

    // 给联系人添加一条消息提醒
    addContactsMessage: (state, { payload }) => {},

    // 给联系人移除一条消息提醒
    clearContactsMessage: (state, { payload }) => {},

    // 当前房间中的所有消息
    activeRoomMessages: (state, { payload }) => {},

    // 给房间内添加一条消息
    addRoomMessages: (state, { payload }) => {},

    // 移除某一条消息 | 只是针对当前窗口移除 | 不等于撤回双方消息
    removeMessage: (state, { payload }) => {},

    // 消息已读
    readRoomMessage: (state, { payload }) => {},

    // 消息撤回
    withdrawRoomMessage: (state, { payload }) => {},

    // 消息发送中 pending
    sendPendingRoomMessage: (state, { payload }) => {},

    // 消息发送成功 success
    sendSuccessRoomMessage: (state, { payload }) => {},

    // 针对消息的某些动作分发
    actionMessage: (state, { payload }) => {},
};

export const Chat = createSlice({
    name: 'chat',
    initialState,
    reducers: chatReducers,
});

export const { updateChatWithUser } = Chat.actions;

export default Chat.reducer;
