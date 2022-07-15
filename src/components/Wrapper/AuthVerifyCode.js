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
        setLoading({
            loading: true,
            disabled: true,
            text: "发送中..."
        })
        const { data: { Code, Msg } } = await sendCaptcha({ email: value, mode: props.mode })
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
        }} className={'w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none'} placeholder="请输入验证码" />
        <Button className={`verify-submit w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 font-semibold ${loading.disabled ? 'verify-disabled' : null}`} type="primary" disabled={loading.disabled} loading={loading.loading} onClick={() => { sendVerifyCode() }}>{loading.text}</Button>
    </div>
}

export default VerifyCode