(function () {
    const jsDom = document.querySelector("#chatjs")
    if (!jsDom) {
        console.error("无法加载Chat: 配置错误")
        return
    }
    const env = jsDom.getAttribute("data-env")
    let host;

    if (env === 'local') {
        host = jsDom.getAttribute("data-url")
    } else {
        try {
            host = jsDom.getAttribute("src").match(/https:\/\/([a-z|A-Z])+\.chat.surest.cn/i)[0]
        } catch (error) {
            host = jsDom.getAttribute("url").match(/https:\/\/([a-z|A-Z])+\.chat.surest.cn/i)[0]
        }
    }

    if (!host) {
        console.error("无法加载Chat: 域名不存在")
        return
    }

    let domWrapper = `
    <div class="chat-mobile-iframe">
        <img class="play-svg" src="https://cdn.surest.cn/chat/im.svg "/>
        <button class="cta">
            <div class="showcase-cta__button-inner">
                <div class="showcase-cta__button__pulse"></div>
            </div>
        </button>
        
    </div>
    `
    const cssDom = document.createElement('link')
    cssDom.setAttribute('rel', "stylesheet")
    cssDom.setAttribute('href', "https://cdn.surest.cn/chat/chat.css")
    document.querySelector("head").appendChild(cssDom)

    setTimeout(() => {
        document.querySelector("body").insertAdjacentHTML('beforeEnd', domWrapper)
        const ctaDom = document.querySelector(".cta")
        const svgDom = document.querySelector(".play-svg")
        let iframeDom = document.querySelector("#iframe-chat")
        const iframeFunc = () => {
            if (!iframeDom) {
                document.querySelector(".chat-mobile-iframe").insertAdjacentHTML("beforeEnd", `<iframe title="iframe" id="iframe-chat" style="display: none" src=${host}/m></iframe>`)
            }
            iframeDom = document.querySelector("#iframe-chat")
            const display = iframeDom.style.display
            if (display === 'block') {
                iframeDom.style.display = "none"
                svgDom.setAttribute("src", 'https://cdn.surest.cn/chat/im.svg')
            } else {
                iframeDom.style.display = "block"
                svgDom.setAttribute("src", 'https://cdn.surest.cn/chat/close.svg')
            }
        }
        ctaDom.addEventListener("click", iframeFunc)
        svgDom.addEventListener("click", iframeFunc)
    }, 1000)
})()