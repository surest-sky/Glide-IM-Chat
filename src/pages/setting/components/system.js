import { Card, Form, Input, Tooltip } from '@arco-design/web-react';
import { IconExclamationCircle } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';
import { updateApp } from 'src/api/chat/app';
import Host from 'src/components/Wrapper/Host';
import ImageUpload from 'src/components/Wrapper/Image';
import { getAuthInfo } from 'src/services/auth';
import store from 'src/store/index';
import { updateAuthInfo } from 'src/store/reducer/container';

import '../styles/system.scss';
const FormItem = Form.Item;

const System = () => {
    const [form] = Form.useForm();
    let userInfo = getAuthInfo()
    const id = userInfo.app.id

    const { run } = useRequest(updateApp, {
        debounceWait: 1000,
        manual: true,
        onSuccess: () => {
            console.log('success')
            userInfo.app.logo = form.getFieldValue("logo")
            userInfo.app.name = form.getFieldValue("name")
            store.dispatch(updateAuthInfo(userInfo))
        }
    });

    const changeSubmit = async () => {
        const data = await form.validate();
        run(id, {
            logo: data.logo,
            name: data.name
        })
    }

    return <div>
        <Card title="平台设置" bordered={false} className="system-container">
            <Form onChange={changeSubmit} initialValues={userInfo?.app} form={form} layout={'vertical'} className="p-2 border border-dashed">
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
                        message: "最少大于5个字符",
                    }
                ]}>
                    <Input placeholder="请输入平台名称" />
                </FormItem>


                <FormItem label="客户端域名配置" field="host">
                    <Host />
                </FormItem>

                <FormItem label='平台LOGO' field={'logo'} >
                    <ImageUpload />
                </FormItem>
            </Form>
        </Card>
    </div>;
}

export default System