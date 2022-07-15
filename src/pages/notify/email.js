import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { Card, Typography } from '@arco-design/web-react';
import './styles/notify.scss';

const Email = () => {
    const [searchParams] = useSearchParams()
    const [code, setCode] = useState("")
    useEffect(() => {
        const code = searchParams.get("code")
        if (!code) {
            window.location.href = "/"
            return
        }
        setCode(code)
    }, [searchParams])
    return <Card className="notify-container">
        <Typography.Title heading={5}> 您的验证码为 </Typography.Title>
        <Typography.Title heading={2}>{code}</Typography.Title>
    </Card>
}


export default Email