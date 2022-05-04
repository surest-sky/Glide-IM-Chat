import './audio.scss';
import { useState } from 'react';
import $ from 'jquery';

const AudioApp = ({ src }) => {
    const content = JSON.parse(src);
    const [play, setPlay] = useState(); // 1: 播放中; 2: 未播放
    const startPlay = () => {
        if (play === true) {
            $('#audio-player')[0].pause();
            setPlay(false);
            return false;
        }
        setPlay(true);
        $('#audio-player').attr('src', content.url);
        $('#audio-player')[0].currentTime = 0;
        $('#audio-player')[0].play();
        $('#audio-player')[0].addEventListener('ended', function () {
            setPlay(false);
        });
    };
    return (
        <div className="flex" onClick={startPlay} onTouchEnd={startPlay}>
            <div className={`record-audio ml-1 mr-1 ${play ? 'wink' : ''}`} style={{ width: 40 }}>
                <span>(</span>
                <span>(</span>
                <span>(</span>
                <span>(</span>
            </div>
            <span>{content.duration}"</span>
        </div>
    );
};

export default AudioApp;
