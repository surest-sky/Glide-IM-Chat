import { sendCaptcha } from 'src/api/chat/common'
import { Button, Input, Message } from '@arco-design/web-react';
import { useState } from 'react';

const VerifyCode = (props) => {
    const defaultLoading = {
        loading: false,
        disabled: false,
        text: "获取验证码"
    }
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(defaultLoading);

    /**
    * 发送验证码
    */
    const sendVerifyCode = async () => {
        const [value, validateMessage] = props.validate()
        if (validateMessage) {
            Message.warning(validateMessage)
            return
        }
        console.log('value', value)
        setLoading({
            loading: true,
            disabled: true,
            text: "发送中..."
        })
        const email = props.getValue()
        const { data: { Code, Msg } } = await sendCaptcha({ email: email })
        if (Code !== 100) {
            Message.warning(Msg)
            setLoading(defaultLoading)
            return
        }

        let max = 60
        const interval = setInterval(() => {
            max--
            setLoading({
                loading: false,
                disabled: true,
                text: `请${max}秒后重试`
            })
            if (max === 0) {
                clearInterval(interval)
                setLoading(defaultLoading)
            }
        }, 1000)
    }

    return <div className="flex input-wrapper">
        <Input value={code} onChange={(value) => {
            setCode(value)
            props.onChange(value)
        }} className={'border border-dashed border-gray-400 verify-input'} placeholder="请输入验证码" />
        <Button type="primary" disabled={loading.disabled} loading={loading.loading} onClick={() => { sendVerifyCode() }}>{loading.text}</Button>
    </div>
}

export default VerifyCode