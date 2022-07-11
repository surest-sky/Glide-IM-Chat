import { Button } from '@arco-design/web-react';
import 'cropperjs/dist/cropper.css';
import { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import { toast } from 'react-toastify';
import { uploadBase64File } from 'src/services/store';


const DCropper = props => {
    const cropperRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const getCorpperImg = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        const base64 = cropper.getCroppedCanvas().toDataURL();
        return base64;
    };

    const onCrop = async () => {
        setLoading(true);
        let url;
        try {
            url = await uploadBase64File(getCorpperImg());
        } catch (error) {
            toast.error(error);
            return false;
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
        props.complete(url);
    };

    return (
        <>
            <Cropper ref={cropperRef} src={props.img} style={{ height: 400, width: '100%' }} aspectRatio={props.aspectRatio} />
            <div className="flex flex-row-reverse tool">
                <Button loading={loading} type="primary" className="mt-5 text-gray-50" onClick={onCrop}>
                    {props.okText ? props.okText : "确定"}
                </Button>
            </div>
        </>
    );
};

export default DCropper;
