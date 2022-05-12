import { ReactComponent as ImageSvg } from '../../../../static/svg/image.svg';
import { ReactComponent as AudioSvg } from '../../../../static/svg/audio.svg';
import { uploadFile } from '../../../../services/upload';
import { useState } from 'react';
import { MessageType } from 'src/core/message';
import { IconHeart, IconNotification } from '@arco-design/web-react/icon';
import { Modal } from '@arco-design/web-react';
import Audio from './audio';
import TransitionSale from 'src/components/TransitionSale';

const Tools = props => {
    const [like, setLike] = useState({
        like: false,
        notify: false,
    });
    const [audioVisible, setAudioVisible] = useState(false);
    const imageUpload = () => {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = async function () {
            var file = this.files[0];
            const { data } = await uploadFile(file, file.name);
            props.sendFileMessage(data.data.url, MessageType.Image);
        };
        input.click();
    };

    return (
        <div className="mr-5 flex">
            <TransitionSale className={`text-3xl mr-2 text-gray-400 hover:text-black ${like.like ? 'icon-select' : ''}`} scale={110}>
                <IconHeart
                    onClick={() => {
                        setLike({ ...like, like: !like.like });
                    }}
                />
            </TransitionSale>
            <TransitionSale className={`text-3xl mr-2 text-gray-400 hover:text-black ${like.notify ? 'icon-select' : ''}`}>
                <IconNotification
                    onClick={() => {
                        setLike({ ...like, notify: !like.notify });
                    }}
                />
            </TransitionSale>

            {/* <ImageSvg onClick={imageUpload} className="tranform cursor-pointer mr-2" />
            <AudioSvg className="tranform cursor-pointer mr-2" onClick={setAudioVisible} /> */}

            <Modal unmountOnExit={true} title={'语音发送'} onCancel={setAudioVisible} visible={audioVisible} footer={null}>
                <Audio
                    setAudioVisible={setAudioVisible}
                    sendFileMessage={data => {
                        setAudioVisible(false);
                        props.sendFileMessage(data, MessageType.Audio);
                    }}
                />
            </Modal>
        </div>
    );
};

export default Tools;
