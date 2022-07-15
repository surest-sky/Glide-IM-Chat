import { Button, Form, Input, Message } from '@arco-design/web-react';
import { useRequest } from 'ahooks';
import { loginUserApi } from 'src/api/im/im';
import store from 'src/store/index';
import { updateAuthInfo } from 'src/store/reducer/container';
const FormItem = Form.Item;

const LoginForm = () => {
    const loginUser = (formData) => {
        return loginUserApi({ email: formData.name, password: formData.password });
    };

    const { run, loading } = useRequest(loginUser, {
        manual: true,
        onSuccess: result => {
            const code = result?.data.Code
            console.log(parseInt(code))
            if (parseInt(code) === 100) {
                store.dispatch(updateAuthInfo(result?.data?.Data));
                Message.success("登录成功...")
                window.location.href = '/workspace'
                return
            }
            Message.error(result?.data.Msg)
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });
    const [form] = Form.useForm();
    const submitForm = async () => {
        const data = await form.validate()
        run(data)
    }

    return (
        <Form wrapperCol={{ span: 24 }} form={form}>
            <FormItem field='name' rules={[
                {
                    required: true,
                    message: '请输入你的用户名'
                },
            ]}>
                <Input placeholder="请输入你的用户名" />
            </FormItem>
            <FormItem field='password' rules={[
                {
                    required: true,
                    message: '请输入你的密码'
                }
            ]}>
                <Input type="password" placeholder="请输入你的密码" />
            </FormItem>
            <FormItem>
                <Button className='w-full' type="primary" loading={loading} onClick={submitForm}>Submit</Button>
            </FormItem>
        </Form>
    );
};
export default LoginForm;
