import { Card, Form } from '@arco-design/web-react';
import Email from 'src/components/Wrapper/Email';
import Phone from 'src/components/Wrapper/Phone';
import { getAuthInfo } from 'src/services/auth';
const FormItem = Form.Item;

const Account = () => {
    const [form] = Form.useForm();
    const userInfo = getAuthInfo()
    const defaultValue = {
        email: userInfo.email,
        phone: userInfo.phone
    }

    return <Card title="账户设置" bordered={false} className="system-container">
        <Form form={form} initialValues={defaultValue}
            layout={'vertical'} className="p-2 border border-dashed">
            <FormItem label="手机号码" field="phone">
                <Phone />
            </FormItem>

            <FormItem label="邮箱" field="email">
                <Email />
            </FormItem>

        </Form>
    </Card >

}

export default Account