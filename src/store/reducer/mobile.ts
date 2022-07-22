import { createSlice } from '@reduxjs/toolkit';
import defaultSettings from '../../settings.json';
import { setLogin } from 'src/services/auth';

export interface GlobalState {
    settings?: typeof defaultSettings;
    userInfo?: {
        account?: string;
        avatar?: string;
        nick_name?: string;
        uid?: string;
    };
    authInfo?: {
        token: string;
        servers: Array<string>;
        uid: string;
    };
}

const initialState: GlobalState = {
    settings: defaultSettings,
    userInfo: {},
    authInfo: {
        token: '',
        servers: [],
        uid: '',
    },
};

const containerReducers = {
    updateSettings: (state, { payload }) => {
        state.settings = payload.settings;
    },
    updateAuthInfo: (state, { payload }) => {
        setLogin(payload);
        state.authInfo = payload;
    },
    updateUserInfo: (state, { payload }) => {
        console.log('payload', payload);
        state.userInfo = payload;
    },
};

const Container = createSlice({
    name: 'Container',
    initialState,
    reducers: containerReducers,
});

export const { updateSettings, updateAuthInfo, updateUserInfo } = Container.actions;

export default Container.reducer;
