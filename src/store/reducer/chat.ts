import { createSlice } from '@reduxjs/toolkit';
import { getContacts } from 'src/api/im/im';
import { ContactsType } from 'src/core/chat_type';
import { addBlukContacts } from 'src/services/chat_db';

export interface ChatState {
    chatWithUser: ContactsType;
}

const initialState: ChatState = {
    chatWithUser: {
        avatar: '',
        name: '',
        message_count: 0,
        uid: 0,
        motto: '',
        lastMessage: {},
    },
};

const chatReducers = {
    // 更新当前活跃用户
    updateChatWithUser: (state, { payload }) => {
        state.chatWithUser = payload.chatWithUser;
    },

    // 更新联系人列表
    updateContacts: () => {
        getContacts().then(constacts => {
            addBlukContacts(constacts);
        });
    },
};

export const Chat = createSlice({
    name: 'chat',
    initialState,
    reducers: chatReducers,
});

export const { updateChatWithUser, updateContacts } = Chat.actions;

export default Chat.reducer;
