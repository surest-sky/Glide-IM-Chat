import { Button, Card, Form, Input, Tooltip } from '@arco-design/web-react';
import { IconExclamationCircle } from '@arco-design/web-react/icon';
import ImageUpload from 'src/components/Wrapper/Image'
import Phone from 'src/components/Wrapper/Phone'
import Email from 'src/components/Wrapper/Email'

import '../styles/system.scss';
const FormItem = Form.Item;

const System = () => {
    const [form] = Form.useForm();
    const submit = async () => {
        const data = await form.validate();
        console.log(data)
    }
    const defaultValue = {
        app_id: 1,
        name: '平台企业1',
        email: 'chenf@surest.cn',
        phone: '18270952773'
    }

    return <div>
        <Card title="平台设置" bordered={false} className="system-container">
            <Form initialValues={defaultValue} form={form} layout={'vertical'} className="p-2 border border-dashed">
                <FormItem label={
                    <>平台ID
                        <Tooltip content='系统凭证,不可修改'>
                            <IconExclamationCircle style={{ margin: '0 8px', color: 'rgb(var(--arcoblue-6))' }} />
                        </Tooltip>
                    </>
                } field={'app_id'}>
                    <Input disabled value="1" />
                </FormItem>
                <FormItem label='平台名称' field={'name'} rules={[
                    {
                        required: true,
                        message: "请输入平台名称",
                    },
                    {
                        maxLength: 30,
                        message: "不要超过 30个字符",
                    },
                    {
                        minLength: 2,
                        message: "最少大于2个字符",
                    }
                ]}>
                    <Input placeholder="请输入平台名称" />
                </FormItem>
                <FormItem label='邮箱' field={'email'} rules={[
                    {
                        required: true,
                        message: "请设置邮箱",
                    }
                ]}>
                    <Email />
                </FormItem>
                <FormItem label='手机号码' field={'phone'} rules={[
                    {
                        required: true,
                        message: "请设置手机号码",
                    }
                ]}>
                    <Phone />
                </FormItem>
                <FormItem label='平台LOGO' field={'logo'} >
                    <ImageUpload />
                </FormItem>
                {/* <FormItem>
                    <Button type='primary' htmlType='submit' long onClick={() => { submit() }}>
                        提交
                    </Button>
                </FormItem> */}
            </Form>
        </Card>
    </div>;
}

export default System