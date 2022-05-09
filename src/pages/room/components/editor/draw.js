import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from 'react-daisyui';
import { uploadBase64File } from './store';
import { useState } from 'react';

const Draw = ({ insertFileMessage, src }) => {
    const cropperRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const onCrop = async () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        const base64 = cropper.getCroppedCanvas().toDataURL();
        console.log(cropper.getCroppedCanvas().toDataURL());
        setLoading(true);
        const url = await uploadBase64File(base64);
        setLoading(false);
        insertFileMessage(url);
    };

    return (
        <>
            <Cropper
                src={src}
                style={{ height: 400, width: '100%' }}
                // Cropper.js options
                initialAspectRatio={16 / 16}
                guides={false}
                ref={cropperRef}
            />
            <div className="tool flex flex-row-reverse">
                <Button loading={loading} color="success" className="text-gray-50 mt-1" onClick={onCrop}>
                    确定
                </Button>
            </div>
        </>
    );
};

export default Draw;
