import { Button } from 'react-daisyui';
import { useState } from 'react';
import { ReactComponent as AudioSvg } from 'src/static/svg/audio.svg';
import { ReactComponent as AudioRecordSvg } from 'src/static/svg/audio-record.svg';

const Audio = () => {
    const [state, setState] = useState('waiting');
    return (
        <div>
            <Button onMouseUp={() => setState('waiting')} onMouseDown={() => setState('recording')}>
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
        </div>
    );
};

export default Audio;
