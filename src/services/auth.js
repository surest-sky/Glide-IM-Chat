import { window } from "rxjs";

const key = "userInfo"
const setLogin = (authInfo) => {
    localStorage.setItem(key, JSON.stringify(authInfo));
}

const isLogin = () => {
    const userInfo = localStorage.getItem(key);
    try {
        const _userInfo = JSON.parse(userInfo)
        return _userInfo.Token
    } catch (error) {
        return false
    }
}

const setLogout = () => {
    localStorage.removeItem(key)
    window.location.reload()
}

const getAuthInfo = () => {
    const defaultVal = {
        Token: "",
        Servers: [],
        Uid: undefined,
    }

    const userInfo = localStorage.getItem(key)
    if (!userInfo) {
        return defaultVal
    }

    try {
        const _userInfo = JSON.parse(userInfo)
        return _userInfo
    } catch (error) {
        return defaultVal
    }
}

const getToken = () => {
    const authInfo = getAuthInfo()
    return authInfo.Token
}

export { setLogout, setLogin, isLogin, getAuthInfo, getToken }