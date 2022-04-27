import { useState } from 'react';
import { Modal, Button } from 'react-daisyui';
import { ReactComponent as JoinSvg } from '../../../static/svg/join.svg';
import Room from './room';

const ImModal = ({ visible, setVisible }) => {
    // tip 提示进入
    // room 房间
    const [mode, setMode] = useState('room');

    /**
     * 加入房间
     */
    const joinRoom = () => {
        setMode('room');
    };

    const ModalImTip = () => {
        return (
            <>
                <Modal.Body className="text-base font-bold"> 现在立即为您接入客服通道， 是否继续？ </Modal.Body>
                <Modal.Actions>
                    <Button
                        color="primary"
                        onClick={() => {
                            joinRoom();
                        }}
                    >
                        <JoinSvg /> <span className="ml-2"> 加入 </span>
                    </Button>
                    <Button
                        onClick={() => {
                            setVisible(false);
                        }}
                    >
                        离开
                    </Button>
                </Modal.Actions>
            </>
        );
    };

    return (
        <Modal
            open={visible}
            onClickBackdrop={() => {
                setVisible(false);
                setMode('');
            }}
        >
            {mode === 'tip' ? <ModalImTip /> : <Room />}
        </Modal>
    );
};

export default ImModal;
