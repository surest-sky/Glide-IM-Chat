import { createSlice } from '@reduxjs/toolkit';
import { ContactsType } from 'src/core/chat_type';

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
    },
};

const chatReducers = {
    updateChatWithUser: (state, { payload }) => {
        console.log(payload);
        state.chatWithUser = payload.chatWithUser;
    },
};

export const Chat = createSlice({
    name: 'chat',
    initialState,
    reducers: chatReducers,
});

export const { updateChatWithUser } = Chat.actions;

export default Chat.reducer;
