import { catchError, map, mergeMap, Observable, of, timeout } from 'rxjs';
import { onComplete, onNext } from 'src/rx/next';
import { getToken, setLogout, getAuthInfo } from 'src/services/auth';
import { Api } from '../api/api';
import { AuthBean } from '../api/model';
import { Glide } from './cache';
import { Actions, CliCustomMessage, CommonMessage, Message, WebSocketUrl } from './message';
import { Session } from './session';
import { Ws } from './ws';
import store from 'src/store/index';
import { updateContacts } from 'src/store/reducer/chat';

export enum MessageLevel {
    // noinspection JSUnusedGlobalSymbols
    LevelDefault,
    LevelInfo,
    LevelError,
    LevelSuccess,
    LevelWarning,
}

export type MessageListener = (level: MessageLevel, msg: string) => void;
export class LiveChat {
    private uid: string;
    private servers: string[] = [];
    private session: Session | null = null;

    public static getInstance(): LiveChat {
        return instance;
    }

    // 初始化认证信息, 连接聊天服务器
    public initChat(): Observable<string> {
        const token = getToken();
        if (!token) {
            console.error('连接聊天服务器 失败: initChat');
            setLogout();
            return;
        }

        // 这里不再鉴权也可以，放到全局去了
        let authrication: Observable<String>;
        authrication = this.initAccount(getAuthInfo());

        return authrication.pipe(
            mergeMap(() => this.connectIMServer()),
            map(() => 'chat init success')
        );
    }

    // depracted
    public register(): Observable<string> {
        return Api.guestLogin().pipe(
            mergeMap(res => this.initAccount(res)),
            mergeMap(() => this.connectIMServer())
        );
    }

    // 获取会话, 如果没有创建则返回 null
    public getSession(): Session | null {
        return this.session;
    }

    // 获取或创建会话
    public getOrInitSession(): Observable<Session> {
        if (this.session != null) {
            return of(this.session);
        }
        return Session.create().pipe(onNext(s => (this.session = s)));
    }

    // deprecated
    public auth(): Observable<string> {
        return Api.auth(this.getToken()).pipe(
            mergeMap(res => {
                return this.initAccount(res);
            }),
            timeout(5000),
            catchError(err => {
                this.clearAuth();
                throw new Error('auth failed: ' + err);
            })
        );
    }

    public logout() {
        this.clearAuth();
        Ws.request(Actions.ApiUserLogout, {}).subscribe({});
        Ws.close();
    }

    private clearAuth() {
        console.log('clearAuth');
        this.uid = '';
        Ws.close();
        Glide.storeToken('');
        setLogout();
    }

    // @deprecated
    public isAuthenticated(): boolean {
        const tk = this.getToken();
        return tk && tk !== '';
    }

    public getUID(): number {
        return parseInt(this.uid);
    }

    public getToken(): string {
        return Glide.getToken();
    }

    private initAccount(auth: AuthBean): Observable<string> {
        // setApiToken(auth.Token);
        this.uid = auth.Uid.toString();
        this.servers = auth.Servers;
        // Glide.storeToken(auth.Token);
        return of('account init success');
    }

    private connectIMServer(): Observable<string> {
        const data = { Token: this.getToken() };
        // const server = this.servers[0];
        const server = WebSocketUrl;

        return Ws.connect(server).pipe(
            mergeMap(() => Ws.request<AuthBean>(Actions.ApiUserAuth, data)),
            map(() => 'IM server auth success'),
            onComplete(() =>
                Ws.addMessageListener(r => {
                    this.onMessage(r);
                })
            )
        );
    }

    private onMessage(m: CommonMessage<any>) {
        switch (m.action) {
            case Actions.NotifyNewContact:
                // 触发更新联系人
                store.dispatch(updateContacts());
                break;
            case Actions.MessageChat:
                const msg = m.data as Message;
                console.log('message: ', msg);
                this.session?.onMessage(msg);
                break;
            case Actions.MessageCli:
                const m2 = m.data as CliCustomMessage;
                console.log('message: ', m2);
                this.session?.onCliCustomMessage(m2);
                break;
            case Actions.MessageChatRecall:
                console.log('接收到消息撤回的提醒: ', m);
                break;
            case Actions.NotifyKickOut:
                alert('被挤下线了, 重新登录');
                this.clearAuth();
                Ws.close();
                break;
            case Actions.NotifyNeedAuth:
                alert('need auth');
                break;
            default:
                console.log('unknown message: ', m);
        }
    }
}

const instance: LiveChat = new LiveChat();
