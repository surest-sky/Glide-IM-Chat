export interface AuthBean {
    Token: string
    Uid: number
    Servers: string[]
}

export interface UserInfoBean {
    Uid: number
    Nickname: string
    Avatar: string
}

export interface MidBean {
    Mid: number
}

export interface OnlineUserInfoBean {
    ID: number
    AliveAt: number
    ConnectionAt: number
    Device: number
}

export interface ServerInfoBean {
    Online: number
    MaxOnline: number
    MessageSent: number
    StartAt: number
    OnlineCli: OnlineUserInfoBean[]
}