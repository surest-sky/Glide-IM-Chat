import { Button, Message } from '@arco-design/web-react';
import { LiveKitRoom } from '@livekit/react-components';
import '@livekit/react-components/dist/index.css';
import { useEffect, useRef, useState } from 'react';
import { getLiveRoomToken } from 'src/api/chat/common';
import Breadcrumb from 'src/components/Breadcrumb';
import Loading from 'src/components/Loading';
import { IconRefresh } from '@arco-design/web-react/icon';
import { getAuthInfo } from 'src/services/auth';
import './index.scss';

const Rebot = () => {
    const userInfo = getAuthInfo();
    const [loading, setLoading] = useState(true);
    const key = `live-room:${userInfo.name}`;
    const url = process.env.REACT_APP_RTC_URL;
    const token = useRef(null);
    async function onConnected(room) {
        await room.localParticipant.setCameraEnabled(true);
        await room.localParticipant.setMicrophoneEnabled(true);
    }

    const loadToken = async () => {
        setLoading(true);
        const {
            data: {
                Data: { sign },
            },
        } = await getLiveRoomToken({ name: userInfo.email }).catch(err => {
            Message.error('服务异常, 请刷新重试');
        });
        console.log('key', sign);
        localStorage.setItem(key, sign);
        token.current = sign;
        setLoading(false);
    };

    useEffect(() => {
        loadToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="setting-container">
            <div className="setting-card card-wrapper">
                <Breadcrumb title="视频聊天" />

                <div className="mb-2 roomContainer">
                    <Button
                        type="primary"
                        status="success"
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        <IconRefresh /> 重新加入视频聊天
                    </Button>
                </div>
                <div className="live-room">{loading ? <Loading /> : <LiveKitRoom url={url} token={token.current} onConnected={room => onConnected(room)} />}</div>
            </div>
        </div>
    );
};

export default Rebot;
