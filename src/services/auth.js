import { addBlukContacts } from 'src/services/chat_db';
const adminKey = "userInfo"
const mobileKey = "mobile:userInfo"
const setLogin = (authInfo, source = null) => {
    const key = source === 'mobile' ? mobileKey : adminKey
    localStorage.setItem(key, JSON.stringify(authInfo));
}

const isLogin = () => {
    const userInfo = localStorage.getItem(adminKey);
    try {
        const _userInfo = JSON.parse(userInfo)
        return _userInfo.token
    } catch (error) {
        return false
    }
}

const setLogout = () => {
    localStorage.removeItem(adminKey)
    addBlukContacts([])
    window.ChatSession = null
}

const loginCount = (action = 'get') => {
    let loginCount = localStorage.getItem("loginCount") || 0;
    if(action === 'get') return loginCount;
    if(action === 'put'){
        loginCount ++;
        localStorage.setItem("loginCount", loginCount)
    }
    if(action === 'del') localStorage.removeItem("loginCount");
}

const getAuthInfo = (source) => {
    const key = source === 'mobile' ? mobileKey : adminKey
    const defaultVal = {
        token: "",
        servers: [],
        uid: undefined,
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
    if (!authInfo) {
        setLogout()
        return ""
    }
    return authInfo.token
}

export { setLogout, setLogin, isLogin, getAuthInfo, getToken, loginCount }