import { Modal } from '@arco-design/web-react';
import * as React from 'react';
import { useRef, useState } from 'react';
import { loadFileBob } from 'src/services/upload';
import Cropper from '../Cropper';

const ImageUpload = props => {
    const [img, setImg] = useState(null);
    const [visible, setVisible] = useState(false);
    const fileType = useRef(null);
    const imageUpload = () => {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = async function () {
            var file = this.files[0];
            const data = await loadFileBob(file);
            fileType.current = data.fileType;
            setImg(data.base64);
            setVisible(true);
        };
        input.click();
    };

    const complete = src => {
        setVisible(false);
        props.onChange(src);
    };

    const ChildrenWithProps = React.cloneElement(props.children, {
        onClick: imageUpload,
    });
    return (
        <div>
            {ChildrenWithProps}
            <Modal
                unmountOnExit={true}
                title="Edit Profile Photo"
                visible={visible}
                onCancel={() => setVisible(false)}
                autoFocus={false}
                focusLock={true}
                footer={null}
            >
                <Cropper img={img} complete={complete} {...props} fileType={fileType.current} />
            </Modal>
        </div>
    );
};

export default ImageUpload;
