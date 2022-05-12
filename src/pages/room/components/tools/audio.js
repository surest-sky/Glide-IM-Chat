import { Button } from 'react-daisyui';
import { Button as Abutton } from '@arco-design/web-react';

import { useState, useRef, useEffect } from 'react';
import { ReactComponent as AudioSvg } from 'src/static/svg/audio.svg';
import { ReactComponent as AudioRecordSvg } from 'src/static/svg/audio-record.svg';
import { uploadFile } from 'src/services/upload';

const Audio = ({ audio, sendFileMessage }) => {
    const [sendAudio, setSendAudio] = useState({
        loading: false,
        src: '',
    });

    const send = async audio => {
        setSendAudio({ loading: true, src: '' });
        const { data } = await uploadFile(audio.blob, `${new Date().getTime()}.mp3`);
        setSendAudio({ loading: false, src: data.data.url });
        sendFileMessage(JSON.stringify({ url: data.data.url, duration: audio.duration }));
    };

    return (
        <div className="ml-5 w-full flex items-center justify-between">
            <audio className="mr-2" style={{ height: 36, width: 240 }} src={audio.stream} controls />
            <Abutton
                className="w-full"
                type="text"
                loading={sendAudio.loading}
                onClick={() => {
                    send(audio);
                }}
            >
                发送
            </Abutton>
        </div>
    );
};

const AudioRecord = ({ sendFileMessage }) => {
    const [state, setState] = useState('waiting');
    const chunks = useRef([]);
    const [audio, setAudio] = useState({ duration: 0, stream: '', blob: '' });
    const recorder = useRef(null);
    const start_int = useRef(0);
    const streamEq = useRef(null);

    const start = () => {
        recorder.current.start();
        // console.log('recorder.current.state', recorder.current.state);
        // start_int.current = new Date().getTime();
        // setAudio({ duration: 0, stream: '', blob: '' });
        // setState('recording');

        setInterval(() => {
            console.log('recorder.current.state', recorder.current.state);
        }, 200);
    };

    const stop = () => {
        // setState(state => {
        //     console.log('state', state);
        //     if (state === 'waiting') {
        //         return;
        //     }
        //     console.log('recorder.current.state', recorder.current.state);
        //     if (recorder.current.state !== 'inactive') {
        //         recorder.current.stop();
        //     }
        //     return 'waiting';
        // });
    };

    const send = async audio => {
        const { data } = await uploadFile(audio.blob, `${new Date().getTime()}.mp3`);
        console.log('send', 'sedn');
        sendFileMessage(JSON.stringify({ url: data.data.url, duration: audio.duration }));
    };

    useEffect(() => {
        initRecord();
    });

    const initRecord = () => {
        const recorderSave = () => {
            let blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' }),
                audioStream = URL.createObjectURL(blob),
                //估算时长
                duration = parseInt((new Date().getTime() - start_int.current) / 1000);
            if (duration <= 0) {
                // alert('说话时间太短');
                // return;
            }
            const _audio = { duration: duration, stream: audioStream, blob: blob };
            setAudio(_audio);
            send(_audio);
            console.log('_audio', _audio);
            chunks.current = [];
        };

        const recorderData = e => {
            chunks.current.push(e.data);
        };

        navigator.mediaDevices.getUserMedia({ audio: true }).then(
            stream => {
                recorder.current = new window.MediaRecorder(stream);
                recorder.current.ondataavailable = recorderData;
                recorder.current.onstop = recorderSave;
                streamEq.current = stream;
            },
            error => {
                alert('出错，请确保已允许浏览器获取录音权限');
            }
        );
    };
    return (
        <div className="flex w-full">
            <Button className="w-full" onMouseUp={stop} onTouchEnd={stop} onTouchStart={start} onMouseDown={start}>
                {state === 'waiting' ? (
                    <>
                        <AudioSvg />
                        <span className="ml-2">长按开始录制</span>
                    </>
                ) : (
                    <>
                        <AudioRecordSvg />
                        <span className="ml-2">松开暂停</span>
                    </>
                )}
            </Button>

            {/* {audio.stream ? <Audio audio={audio} sendFileMessage={sendFileMessage} /> : null} */}
        </div>
    );
};

export default AudioRecord;
