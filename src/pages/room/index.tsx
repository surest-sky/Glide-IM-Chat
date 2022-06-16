import { useEffect, useRef, useState } from 'react';
import { Image, Modal, Spin, Grid, Avatar, Divider } from '@arco-design/web-react';
import { delay } from 'rxjs';
import { ChatMessage } from 'src/core/chat_message';
import { MessageType } from 'src/core/message';
import { LiveChat } from 'src/core/live_chat';
import { Session } from 'src/core/session';
import Editor from './components/editor';
import Message from './components/message';
import { initChat } from './store/chat';
import Tools from './components/tools';
import dayjs from 'dayjs';
import { scrollToBottom } from 'src/utils/Utils';
import AudioHtml from 'src/components/AudioHtml';
import { ChatRobot } from './store/chatrd';
import Menu from './menu';
import './styles/room.scss';

const Row = Grid.Row;
const Col = Grid.Col;

const Room = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const editorRef = useRef<any>(null);
    const [imageVisible, setImageVisible] = useState<any>({
        visible: false,
        src: '',
    });
    const visible = true;

    useEffect(() => {
        session?.setMessageListener(message => {
            setMessages(messages => [...messages, message]);
            setTimeout(() => {
                scrollToBottom('.room-content');
            }, 100);
        });
        return () => session?.setMessageListener(null);
    }, [session]);

    const initFirstMessage = () => {
        const robot = new ChatRobot();
        const fmsg = robot.loadMessageByFirst();
        const chatMsg = new ChatMessage();
        chatMsg.Content = fmsg;
        setMessages([...messages, chatMsg]);
    };

    const started = () => {
        // 获取或初始化聊天会话
        LiveChat.getInstance()
            .getOrInitSession()
            .pipe(delay(1000))
            .subscribe({
                next: se => {
                    se.notifyInputMessage();
                    setSession(se);
                    setMessages(se.getMessages());
                    setLoading(false);
                    setTimeout(() => {
                        $('.room-container').on('click', 'img', (element: any) => {
                            const src = element.target.getAttribute('src');
                            setImageVisible({ visible: true, src: src });
                        });
                    });
                },
                error: error => {
                    console.log(error);
                },
                complete: () => {
                    setTimeout(() => {
                        initFirstMessage();
                    }, 1000);
                },
            });
    };

    useEffect(() => {
        initChat(started);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dateLine = (at, key) => {
        const dateDayjs = dayjs(at * 1000);
        const _date = dateDayjs.format('YYYY-MM-DD HH:mm:ss');
        if (key === 0) {
            return _date;
        }

        let lastAt = dayjs(messages[key - 1].SendAt * 1000);
        if (dateDayjs.diff(lastAt, 'minute') > 1) {
            return _date;
        }

        const fl: any = key / 5;
        if (fl % 1 === 0) {
            return _date;
        }
        return false;
    };

    const sendFileMessage = (message: string, type: MessageType, callback: any) => {
        session.send(message, type).subscribe({
            next: m => {
                console.log('send message: message status changed=>', m);
            },
            error: error => {
                callback && callback();
            },
            complete: () => {
                callback && callback();
            },
        });
    };

    const MsgList = messages.map((message, key) => {
        const _dateline = dateLine(message.SendAt, key);
        return (
            <div key={key}>
                {_dateline ? <div className="mt-5 mb-5 text-xs text-center text-gray-500">{_dateline}</div> : <></>}
                <Message setVisible={setImageVisible} key={message.SendAt} message={message} />
            </div>
        );
    });

    let content: any;
    if (loading) {
        content = (
            <div className="flex items-center justify-center w-full h-full loadin-container">
                <Spin className="mr-2" /> 加入中...
            </div>
        );
    } else {
        content = (
            <div className="room-container">
                <Row className="h-full">
                    <Col span={4} xl={4} lg={6} md={6} className="h-full p-2 bg-white border-r border-gray-300">
                        <Menu />
                    </Col>
                    <Col span={20} xl={20} lg={18} md={18} className="h-full">
                        <div className="flex justify-between h-full">
                            <div className="w-2/3 p-5">
                                <div className="flex justify-between font-bold text-center room-content-title">
                                    <div className="flex items-center">
                                        <Avatar className="mr-2">
                                            <img alt="avatar" src="https://api.surest.cn/storage/resource/20220511/1652258608-1652258607609.png" />
                                        </Avatar>
                                        <div className="title-name ">Dianne Vanhorn</div>
                                    </div>
                                    <div className="flower">
                                        <Tools sendFileMessage={sendFileMessage} />
                                    </div>
                                </div>
                                <div className="room-body">
                                    <div className="chat-body">
                                        <div className="room-content scrollbar">
                                            <div className="room-content-wrapper">{MsgList}</div>
                                        </div>
                                        <Editor editorRef={editorRef} sendFileMessage={sendFileMessage} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center w-1/3 bg-slate-50 align-center">
                                <div className="">
                                    <div className="flex justify-center mt-10">
                                        <Avatar size={128}>
                                            <img alt="avatar" src="https://api.surest.cn/storage/resource/20220511/1652258608-1652258607609.png" />
                                        </Avatar>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <div className="text-2xl ">Dianne Vanhorn</div>
                                        <div className="text-base text-gray-500 ">Junior Developer</div>
                                    </div>

                                    <div className="flex justify-center mt-10">
                                        <div>
                                            <svg className="mx-auto text-6xl transition ease-in-out cursor-pointer icon hover:scale-110" style={{ color: '#1990FF' }} aria-hidden="true">
                                                <use xlinkHref="#icon-dianhua1"></use>
                                            </svg>
                                            <div className="mt-2 font-bold text-center">Voice Call</div>
                                        </div>
                                        <div className="ml-10 mr-10 ">
                                            <Divider type="vertical" style={{ height: 60 }} />
                                        </div>
                                        <div className="text-center">
                                            <svg className="mx-auto text-6xl transition ease-in-out cursor-pointer icon hover:scale-110" aria-hidden="true">
                                                <use xlinkHref="#icon-shipintonghua"></use>
                                            </svg>
                                            <div className="mt-2 font-bold ">Video Call</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Image.Preview
                    src={imageVisible.src}
                    visible={imageVisible.visible}
                    onVisibleChange={() => {
                        setImageVisible({ visible: false, src: '' });
                    }}
                />
                <AudioHtml />
            </div>
        );
    }

    return (
        <div className="room">
            <Modal title="" className="room-modal" closeIcon={null} footer={null} visible={visible} autoFocus={false} focusLock={true}>
                {content}
            </Modal>
        </div>
    );
};

export default Room;
