
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
        return _userInfo.Token
    } catch (error) {
        return false
    }
}

const setLogout = () => {
    localStorage.removeItem(adminKey)
    window.location.reload()
}

const getAuthInfo = (source) => {
    const key = source === 'mobile' ? mobileKey : adminKey
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
    if (!authInfo) {
        setLogout()
        return ""
    }
    return authInfo.Token
}

export { setLogout, setLogin, isLogin, getAuthInfo, getToken }