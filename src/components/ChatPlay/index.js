import './styles/index.scss';
import { ReactComponent as ImSvg } from 'src/static/svg/im.svg';
import { ReactComponent as CloseSvg } from 'src/static/svg/close.svg';
import { useState } from 'react'
import { useSelector } from 'react-redux';
import lodash from 'lodash'

const ChatPlay = () => {
    const authInfo = useSelector((state: any) => state.container.authInfo);
    const [visible, setVisible] = useState(false)
    const host = lodash.get(authInfo, 'app.host')
    if (!host) {
        return <></>
    }
    return <div className="chat-mobile-iframe">
        {visible ? <CloseSvg className="play-svg " onClick={() => {
            setVisible(!visible)
        }} /> : <ImSvg className="play-svg " onClick={() => {
            setVisible(!visible)
        }} />}
        <button className="cta" onClick={() => {
            setVisible(!visible)
        }}>
            <div className="showcase-cta__button-inner">
                <div className="showcase-cta__button__pulse"></div>
            </div>
        </button>
        {
            visible ? <iframe title="iframe" src={`http://${host}/m`}></iframe> : <></>
        }

    </div>
}

export default ChatPlay