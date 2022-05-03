import { Button } from 'react-daisyui';
import { Link } from '@arco-design/web-react';
import { useState, useRef, useEffect } from 'react';
import { ReactComponent as AudioSvg } from 'src/static/svg/audio.svg';
import { ReactComponent as AudioRecordSvg } from 'src/static/svg/audio-record.svg';
import './audio.scss';

const Audio = ({ src }) => {
    // console.log(audio);
    return (
        <div className="ml-5 flex items-center justify-between">
            {/* <span>{audio?.duration}</span> */}
            {/* <div className="record-audio" style={{ width: 40 }}>
                <span>(</span>
                <span>(</span>
                <span>(</span>
            </div> */}
            <audio className="mr-2" style={{ height: 36, width: 250 }} src={src} controls />
            <Link>发送</Link>
        </div>
    );
};

const AudioRecord = () => {
    const [state, setState] = useState('waiting');
    const chunks = useRef([]);
    const [audio, setAudio] = useState({ duration: 0, stream: '' });
    const recorder = useRef(null);

    const start = () => {
        recorder.current.start();
        setAudio({ duration: 0, stream: '' });
        setState('recording');
    };

    const stop = () => {
        setState('waiting');
        recorder.current.stop();
    };

    useEffect(() => {
        initRecord();
    }, []);

    const initRecord = () => {
        const recorderSave = () => {
            let blob = new Blob(chunks.current, { type: 'audio/ogg; codecs=opus' }),
                audioStream = URL.createObjectURL(blob),
                //估算时长
                duration = parseInt(blob.size / 6600);
            if (duration <= 0) {
                alert('说话时间太短');
                return;
            }
            if (duration > 60) {
                duration = 60;
            }
            const _audio = { duration: duration, stream: audioStream };
            console.log(_audio);
            setAudio(_audio);
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
            },
            error => {
                alert('出错，请确保已允许浏览器获取录音权限');
            }
        );
    };
    return (
        <div className="flex">
            <Button onMouseUp={stop} onMouseDown={start}>
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

            {audio.stream ? <Audio src={audio.stream} /> : null}
        </div>
    );
};

export default AudioRecord;
