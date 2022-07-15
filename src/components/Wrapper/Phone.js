import { Form, Input, Link, Message, Modal, Tooltip } from '@arco-design/web-react';
import { useState } from 'react';
import VerifyCode from './VerifyCode'
import './styles/input.scss';

const FormItem = Form.Item;
const Phone = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const value = props.value

    return <Link>待开放中...</Link>

    // 验证码提交
    const submit = async () => {
        const data = await form.validate()
        console.log(data)
        setConfirmLoading(true)

        setTimeout(() => {
            setConfirmLoading(false)
            Message.success("修改成功")
        }, 2000)
    }

    const validateAllowCode = () => {
        const phone = form.getFieldValue("phone")
        if (!phone) {
            return ['', "请先输入手机号码"]
        }
        return [phone, ""]
    }

    return <div>
        <Tooltip mini content='点击修改手机号码'>
            <Link onClick={() => { setVisible(true) }}>{value ? value : '设置手机号码'}</Link>
        </Tooltip>

        <Modal
            title='手机号码设置'
            visible={visible}
            onOk={() => submit()}
            onCancel={() => setVisible(false)}
            autoFocus={false}
            focusLock={true}
            confirmLoading={confirmLoading}
        >
            <Form
                form={form}
                layout={'vertical'}
            >
                <FormItem className="w-full" field='phone' rules={[
                    {
                        required: true,
                        message: "请输入手机号码",
                    },
                    {
                        match: /(1[3|4|5|7|8][0-9]{9})/,
                        message: "请输入正确的手机号码",
                    }
                ]}>
                    <Input className={' border border-dashed border-gray-400'} placeholder="请输入手机号码" />
                </FormItem>
                <FormItem field='verifyCode' rules={[
                    {
                        required: true,
                        message: "请输入验证码",
                    },
                    {
                        length: 4,
                        message: "验证码错误"
                    }
                ]}>
                    <VerifyCode validate={validateAllowCode} />
                </FormItem>
            </Form>

        </Modal>
    </div>
}

export default Phone