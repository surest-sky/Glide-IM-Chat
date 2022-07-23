import { Button, Form, Link, Input, Message } from '@arco-design/web-react';
import { useRequest } from 'ahooks';
import { loginUserApi } from 'src/api/im/im';
import store from 'src/store/index';
import { updateAuthInfo } from 'src/store/reducer/container';
import { ReactComponent as WechatSvg } from 'src/static/svg/wechat.svg';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const FormItem = Form.Item;
const LoginForm = (props) => {
    const navigate = useNavigate();
    const defaultLoading = {
        loading: false,
        disabled: false,
        text: "登录"
    }
    const [loading, setLoading] = useState(defaultLoading)
    const loginUser = formData => {
        return loginUserApi({ email: formData.name, password: formData.password, device: 1 });
    };
    const { run } = useRequest(loginUser, {
        manual: true,
        onSuccess: result => {
            const code = result?.data.Code;
            if (parseInt(code) === 100) {
                store.dispatch(updateAuthInfo(result?.data?.Data));
                Message.success('登录成功...');
                setTimeout(() => {
                    window.location.href = '/workspace';
                }, 1000)
                return;
            }
            Message.error(result?.data.Msg);
        },
        onFinally: () => {
            setLoading(defaultLoading);
        },
        onError: (result, params) => {
            console.log(result, params);
        },
    });
    const [form] = Form.useForm();
    const submitForm = async () => {
        const data = await form.validate();
        setLoading({
            loading: true,
            disabled: true,
            text: "登录中"
        })
        run(data);
    };

    return (
        <div className="login-container">
            <section className="flex flex-col md:flex-row h-screen items-center">
                <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
                    <img src="https://source.unsplash.com/random" alt="" className="w-full h-full object-cover" />
                </div>

                <div
                    className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center"
                >
                    <div className="w-full h-100">
                        <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">登录你的账户</h1>

                        <Form className="mt-6" wrapperCol={{ span: 24 }} form={form}>
                            <label className="block text-gray-700">邮箱</label>
                            <FormItem field='name' rules={[
                                {
                                    required: true,
                                    message: '请输入你的邮箱'
                                },
                            ]}>
                                <Input placeholder="请输入你的用户名" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" />
                            </FormItem>

                            <label className="block text-gray-700">密码</label>
                            <FormItem field='password' rules={[
                                {
                                    required: true,
                                    message: '请输入你的密码'
                                }
                            ]}>
                                <Input type="password" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" placeholder="请输入你的密码" />
                            </FormItem>

                            <div className="text-right mb-2">
                                <Link onClick={() => navigate('/forget')}>忘记密码 ?</Link>
                            </div>

                            <FormItem>
                                <Button size='large' className='submit-login w-full rounded-lg bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 font-semibold ' type="primary" disabled={loading.disabled} loading={loading.loading} onClick={submitForm}>{loading.text}</Button>
                            </FormItem>
                        </Form>

                        <hr className="my-6 border-gray-300 w-full" />
                        <button type="button" className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300">
                            <div className="flex items-center wechat-login justify-center">
                                <WechatSvg />
                                <span className="ml-4" onClick={() => { Message.warning('等待接入中...') }}>使用微信扫码登录</span>
                            </div>
                        </button>

                        <p className="mt-8">
                            <Link onClick={() => navigate('/register')}>去注册</Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default LoginForm;
