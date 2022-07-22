export interface AuthBean {
    token: string;
    uid: string;
    servers: string[];
}

export interface UserInfoBean {
    uid: number;
    nick_name: string;
    avatar: string;
}

export interface MidBean {
    mid: number;
}

export interface OnlineUserInfoBean {
    ID: number;
    AliveAt: number;
    ConnectionAt: number;
    Device: number;
}

export interface ServerInfoBean {
    Online: number;
    MaxOnline: number;
    MessageSent: number;
    StartAt: number;
    OnlineCli: OnlineUserInfoBean[];
}
