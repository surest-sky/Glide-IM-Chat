
import { Image } from '@arco-design/web-react';
import ImageUpload from 'src/components/ImageUpload';

// 图片上传
const ImageC = (props) => {
    // onClick={() => {
    //     uploadDomFile('.png,.jpeg,.jpg', (new Date()).getTime() + '.png', (address) => {
    //         Message.success("上传成功")
    //         props.onChange(address)
    //     });
    // }}
    return <div className="image-upload-wrapper">
        <Image
            style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: "1px solid #ccc" }}
            width={50}
            src={props.value ? props.value : "https://cdn.surest.cn/chat/dot-v2.png"}
            alt='logo'
        />
        <ImageUpload aspectRatio={5 / 5} onChange={value => props.onChange(value)} size={64} src={props.value}>
            <div className='image-upload-mask' >更新</div>
        </ImageUpload>
    </div>
}

export default ImageC