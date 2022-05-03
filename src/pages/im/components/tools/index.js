import { ReactComponent as ImageSvg } from '../../../../static/svg/image.svg';
import { ReactComponent as AudioSvg } from '../../../../static/svg/audio.svg';
import { uploadFile } from '../../../../services/upload';
import { useState } from 'react';
import { MessageType } from 'src/core/message';
import { Modal } from '@arco-design/web-react';
import Audio from './audio';

const Tools = props => {
    const [audioVisible, setAudioVisible] = useState(false);
    const imageUpload = () => {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = async function () {
            var file = this.files[0];
            const { data } = await uploadFile(file, file.name);
            props.sendFileMessage(data.data.url, MessageType.text);
        };
        input.click();
    };
    return (
        <div className="mr-5 flex">
            <ImageSvg onClick={imageUpload} className="tranform cursor-pointer mr-2" />
            <AudioSvg className="tranform cursor-pointer mr-2" onClick={setAudioVisible} />

            <Modal title={'语音发送'} onCancel={setAudioVisible} visible={audioVisible} footer={null}>
                <Audio setAudioVisible={setAudioVisible} />
            </Modal>
        </div>
    );
};

export default Tools;
