export const ContactStatus = {
    offline: 0,
    online: 1
}

export const ContactOpend = {
    opend: 1,
    close: 0
}

export const MessageStatus = {
    default: 0,
    recall: 2,
    read: 1
}

export const LoadFailText = process.env.NODE_ENV === 'production' ? '未配置域名, 无法加载!' : `开发环境请选择账号设置域名为${window.location.href}`;