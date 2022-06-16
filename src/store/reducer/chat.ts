import { createSlice } from '@reduxjs/toolkit';
import { ContactsType } from 'src/core/chat_type';

export interface ChatState {
    activeUser: ContactsType;
}

const initialState: ChatState = {
    activeUser: {
        avatar: '',
        name: '',
        message: '',
        uid: 0,
        motto: '',
    },
};

const chatReducers = {
    updateActiveUser: (state, { payload }) => {
        console.log(payload);
        state.activeUser = payload.activeUser;
    },
};

export const Chat = createSlice({
    name: 'chat',
    initialState,
    reducers: chatReducers,
});

export const { updateActiveUser } = Chat.actions;

export default Chat.reducer;
