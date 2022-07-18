import { UserInfoBean } from 'src/api/model';
import { getToken } from 'src/services/auth';
import { setCookie } from 'src/utils/Cookies';

class GlideIM {
    private tempUserInfo = new Map<number, UserInfoBean>();

    public getToken(): string {
        return getToken();
    }

    public storeToken(token: string) {
        setCookie('token', token, 1);
    }

    public getUserInfo(id: number): UserInfoBean | null {
        let i = this.tempUserInfo.get(id);
        if (i != null) {
            return i;
        }
        return null;
        // const res = this._readObject(`ui_${id}`);
        // this.tempUserInfo.set(id, res);
        // return res
    }

    private _readObject(key: string): any | null {
        const val = localStorage.getItem(key);
        if (val === null) {
            return null;
        }
        return JSON.parse(val);
    }

    private _writeObject(key: string, val: any): void {
        localStorage.setItem(key, JSON.stringify(val));
    }
}

export const Glide = new GlideIM();
