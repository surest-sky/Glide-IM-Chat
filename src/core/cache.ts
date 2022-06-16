import { groupBy, map, mergeMap, Observable, of, toArray } from 'rxjs';
import { UserInfoBean } from 'src/api/model';
import { onNext } from 'src/rx/next';
import { getToken } from 'src/services/auth';
import { setCookie } from 'src/utils/Cookies';
import { Api } from '../api/api';

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

    public loadUserInfo(...id: number[]): Observable<UserInfoBean[]> {
        return of(...id).pipe(
            groupBy<number, boolean>(id => {
                return this.getUserInfo(id) != null;
            }),
            mergeMap(g => {
                if (g.key) {
                    return g.pipe(map(id => this.getUserInfo(id)));
                } else {
                    return g.pipe(
                        toArray(),
                        mergeMap(ids => {
                            return Api.getUserInfo(...ids);
                        }),
                        mergeMap(userInfos => of(...userInfos))
                    );
                }
            }),
            toArray(),
            onNext(userInfo => {
                userInfo.forEach(u => {
                    this._writeObject(`ui_${id}`, u);
                    this.tempUserInfo.set(u.Uid, u);
                });
            })
        );
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
