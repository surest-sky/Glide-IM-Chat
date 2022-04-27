
export function isMobile(): boolean {
    let mobileAgent = false;///Android|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    let smallScreen = (window.innerWidth < 600);
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
    const wrapper = document.querySelector(_class)
    console.log('wrapperScroolHeight', wrapper)
    if(!wrapper) {return;}
    const wrapperScroolHeight = wrapper.scrollHeight;
    wrapper.scrollTop = wrapperScroolHeight
}