import { createSlice } from '@reduxjs/toolkit';
import defaultSettings from '../../settings.json';

export interface GlobalState {
    settings?: typeof defaultSettings;
    userInfo?: {
        name?: string;
        avatar?: string;
        job?: string;
        organization?: string;
        location?: string;
        email?: string;
        permissions: Record<string, string[]>;
    };
    authInfo?: {
        token: string;
        servers: Array<string>;
        uid: string;
    };
}

const initialState: GlobalState = {
    settings: defaultSettings,
    userInfo: {
        permissions: {},
    },
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
        state.authInfo = payload.authInfo;
    },
    updateUserInfo: (state, { payload }) => {
        const { userInfo = initialState.userInfo, userLoading } = payload;
        state.userInfo = userInfo;
        state.userLoading = userLoading;
    },
};

const Container = createSlice({
    name: 'Container',
    initialState,
    reducers: containerReducers,
});

export const { updateSettings, updateAuthInfo, updateUserInfo } = Container.actions;

export default Container.reducer;
