import { useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import { ReactComponent as JoinSvg } from '../../../static/svg/join.svg';
import { useNavigate } from 'react-router-dom';
import Room from '../room';

const ImModal = ({ visible, setVisible }) => {
    const navigation = useNavigate();

    /**
     * 加入房间
     */
    const joinRoom = () => {
        navigation('/room');
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
            }}
        >
            <ModalImTip />
        </Modal>
    );
};

export default ImModal;
