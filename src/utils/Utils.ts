import dayjs from 'dayjs';

export function isMobile(): boolean {
    let mobileAgent = false; ///Android|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    let smallScreen = window.innerWidth < 600;
    return mobileAgent || smallScreen;
}

// https://blog.csdn.net/qq_43437571/article/details/106088271
export const getMessageLen = str => {
    var count = 0;
    if (!str) {
        const len = str.length;
        for (var i = 0; i < len; i++) {
            if (str.charCodeAt(i) > 255) {
                count += 2;
            } else {
                count++;
            }
        }
    }
    return count;
};

/**
 *
 * @param _class string Dom 节点
 */
export function scrollToBottom(_class) {
    const wrapper = document.querySelector(_class);
    if (!wrapper) {
        return;
    }
    const wrapperScroolHeight = wrapper.scrollHeight;
    wrapper.scrollTop = wrapperScroolHeight;
}

export function eventDelegation(element, eventType, selector, func) {
    element.addEventListener(eventType, function (e) {
        let el = e.target;
        while (!el.matches(selector)) {
            if (el === element) {
                el = null;
                break;
            }
            el = el.parentNode;
        }
        el && func.call(el, el, e);
    });
    return element;
}

export const dateLine = (at, key, messages) => {
    const dateDayjs = dayjs(at * 1000);
    const _date = dateDayjs.format('YYYY-MM-DD HH:mm:ss');
    if (key === 0) {
        return _date;
    }

    let lastAt = dayjs(messages[key - 1].sendAt * 1000);
    if (dateDayjs.diff(lastAt, 'minute') > 1) {
        return _date;
    }

    const fl: any = key / 10;
    if (fl % 1 === 0) {
        return _date;
    }
    return false;
};

export function timeAgo(timestamp) {
    if (!timestamp) {
        return '';
    }

    timestamp = dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss');
    const minutes = dayjs().diff(dayjs(timestamp), 'minute');
    if (minutes <= 2) {
        return '刚刚';
    }

    if (minutes <= 60) {
        return minutes + '分钟前';
    }

    const hours = dayjs().diff(dayjs(timestamp), 'hours');
    if (hours <= 24) {
        return hours + '小时前';
    }

    const weeks = dayjs().diff(dayjs(timestamp), 'day');
    if (weeks <= 7) {
        return weeks + '天前';
    }

    return dayjs(timestamp).format('YYYY-MM-DD');
}

export const setFavicon = src => {
    var link = document.createElement('link');
    var oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
};

export const setDomainTitle = title => {
    document.title = title;
};

// 获取目标位置滚动条距离底部的距离
export const getScrollBottom = (targetWrapper, target) => {
    const targetWrapperHeight = document.querySelector(targetWrapper).scrollHeight;
    const targetScrollTop = document.querySelector(target).scrollTop;
    const scrollBottom = targetWrapperHeight - targetScrollTop;
    return scrollBottom;
};

// 移动目标到指定位置
export const scrollToTop = (targetWrapper, target, height) => {
    const targetWrapperHeight = document.querySelector(targetWrapper).scrollHeight;
    const scrollTop = targetWrapperHeight - height;
    document.querySelector(targetWrapper).scrollTop = scrollTop;
};
