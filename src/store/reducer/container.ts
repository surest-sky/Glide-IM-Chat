import { createSlice } from '@reduxjs/toolkit';
import defaultSettings from '../../settings.json';
import { setLogin } from 'src/services/auth';

export interface GlobalState {
    settings?: typeof defaultSettings;
    userInfo?: {
        Account?: string;
        Avatar?: string;
        Nickname?: string;
        Uid?: string;
    };
    authInfo?: {
        Token: string;
        Servers: Array<string>;
        Uid: string;
    };
    categoryList?: [];
}

const initialState: GlobalState = {
    settings: defaultSettings,
    userInfo: {},
    authInfo: {
        Token: '',
        Servers: [],
        Uid: '',
    },
    categoryList: [],
};

const containerReducers = {
    updateSettings: (state, { payload }) => {
        state.settings = payload.settings;
    },
    updateAuthInfo: (state, { payload }) => {
        setLogin(payload);
        state.authInfo = payload;
        state.userInfo.Uid = payload.Uid;
    },
    updateUserInfo: (state, { payload }) => {
        state.userInfo = payload;
    },
    updateCategory: (state, { payload }) => {
        state.categoryList = payload;
    },
};

const Container = createSlice({
    name: 'Container',
    initialState,
    reducers: containerReducers,
});

export const { updateSettings, updateCategory, updateAuthInfo, updateUserInfo } = Container.actions;

export default Container.reducer;
