import { configureStore } from '@reduxjs/toolkit';
import chat from './reducer/chat';
import container from './reducer/container';

export default configureStore({
    reducer: {
        chat: chat,
        container: container,
    },
});
