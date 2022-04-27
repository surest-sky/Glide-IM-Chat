import { catchError, concat, map, mergeMap, Observable, of, timeout } from "rxjs";
import { onComplete, onNext } from "src/rx/next";
import { Api } from "../api/api";
import { setApiToken } from "../api/axios";
import { AuthBean } from "../api/model";
import { Glide } from "./cache";
import { Actions, CommonMessage, Message } from "./message";
import { Session } from "./session";
import { Ws } from "./ws";

export enum MessageLevel {
    // noinspection JSUnusedGlobalSymbols
    LevelDefault,
    LevelInfo,
    LevelError,
    LevelSuccess,
    LevelWarning
}

export type MessageListener = (level: MessageLevel, msg: string) => void
export class LiveChat {

    private uid: string;
    private servers: string[] = [];
    private session: Session | null = null

    public static getInstance(): LiveChat {
        return instance;
    }

    // 初始化认证信息, 连接聊天服务器
    public initChat(): Observable<string> {
        const token = this.getToken()

        let authrication: Observable<AuthBean>;
        if (token == null || token === "") {
            authrication = Api.guestLogin()
        } else {
            authrication = Api.auth(token)
                .pipe(
                    catchError(err => {
                        this.clearAuth();
                        throw new Error("auth failed: " + err);
                    })
                )
        }

        return authrication.pipe(
            mergeMap(res => this.initAccount(res)),
            mergeMap(() => this.connectIMServer()),
            map(() => "chat init success")
        )
    }

    // depracted
    public register(): Observable<string> {
        return Api.guestLogin()
            .pipe(
                mergeMap(res => this.initAccount(res)),
                mergeMap(() => this.connectIMServer()),
            )
    }

    // 获取会话, 如果没有创建则返回 null
    public getSession(): Session | null {
        return this.session;
    }

    // 获取或创建会话
    public getOrInitSession(): Observable<Session> {
        if (this.session != null) {
            return of(this.session)
        }
        return Session.create()
            .pipe(
                onNext(s => this.session = s)
            )
    }

    // deprecated
    public auth(): Observable<string> {

        return Api.auth(this.getToken())
            .pipe(
                mergeMap(res => {
                    return this.initAccount(res)
                }),
                timeout(5000),
                catchError(err => {
                    this.clearAuth();
                    throw new Error("auth failed: " + err);
                })
            )
    }

    public logout() {
        this.clearAuth()
        Ws.request(Actions.ApiUserLogout, {})
            .subscribe({});
        Ws.close()
    }

    private clearAuth() {
        console.log("clearAuth");
        this.uid = "";
        Ws.close();
        Glide.storeToken("");
    }

    // @deprecated
    public isAuthenticated(): boolean {
        const tk = this.getToken()
        return tk && tk !== "";
    }

    public getUID(): number {
        return parseInt(this.uid);
    }

    public getToken(): string {
        return Glide.getToken();
    }

    private initAccount(auth: AuthBean): Observable<string> {

        setApiToken(auth.Token);
        this.uid = auth.Uid.toString();
        this.servers = auth.Servers;
        Glide.storeToken(auth.Token);
        return of("account init success");
    }

    private connectIMServer(): Observable<string> {

        const data = { Token: this.getToken() };
        const server = this.servers[0];

        return Ws.connect(server)
            .pipe(
                mergeMap(() => Ws.request<AuthBean>(Actions.ApiUserAuth, data)),
                map(() => "IM server auth success"),
                onComplete(() => Ws.addMessageListener((r) => {
                    this.onMessage(r)
                })),
            )
    }

    private onMessage(m: CommonMessage<any>) {
        switch (m.Action) {
            case Actions.NotifyNewContact:
                console.log("new contact: " + m.Data);
                break;
            case Actions.MessageChat:
                const msg = m.Data as Message
                console.log("message: ", msg);
                this.session?.onMessage(msg)
                break;
            case Actions.MessageChatRecall:
                break;
            case Actions.NotifyKickOut:
                break;
            case Actions.NotifyNeedAuth:

                break;
        }
    }
}

const instance: LiveChat = new LiveChat();