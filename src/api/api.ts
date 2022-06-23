import { Observable } from 'rxjs';
import { getBaseUrl, post, setBaseUrl } from './axios';
import { AuthBean, MidBean, ServerInfoBean, UserInfoBean } from './model';
import { rxios } from './rxios';

function guestLogin(): Observable<AuthBean> {
    return rxios.post('auth/guest', {
        Nickname: '',
        Avatar: '',
    });
}

function getCustomerService(): Observable<UserInfoBean> {
    return rxios.post('cs/get');
}

function auth(token: string): Observable<AuthBean> {
    const param = {
        Token: token,
    };
    return rxios.post('auth/token', param);
}

function getUserInfo(...uids: number[]): Promise<UserInfoBean[]> {
    return post('user/info', { Uid: uids });
}

function getMid(): Observable<MidBean> {
    return rxios.post('msg/id');
}

function getServerInfo(): Observable<ServerInfoBean> {
    return rxios.get('app/info');
}

export const Api = {
    setBaseUrl,
    getBaseUrl,
    getUserInfo,
    auth,
    getMid,
    getCustomerService,
    guestLogin,
    getServerInfo,
} as const;
