import { Avatar, Button, Form, Input, Modal, Tooltip } from '@arco-design/web-react';
import { useState } from 'react';
import { setLogout } from 'src/services/auth';
import './styles/modules.scss';

const FormItem = Form.Item;
const Modules = ({ userInfo }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <Tooltip content="我的资料">
                <Avatar
                    size={32}
                    className="cursor-pointer"
                    onClick={() => {
                        setVisible(true);
                    }}
                >
                    {userInfo.Uid}
                </Avatar>
            </Tooltip>

            <Modal className="profile-container" visible={visible} footer={null} onCancel={() => setVisible(false)}>
                <Avatar className="avatar" size={68}>
                    {/* <img src={userInfo.Avatar} alt="" /> */}
                    {userInfo.Uid}
                </Avatar>

                <Form initialValues={userInfo} wrapperCol={{ span: 24 }} className="mt-20">
                    <FormItem field="Uid">
                        <Input placeholder="用户ID" disabled={true} />
                    </FormItem>
                    <FormItem field="Nickname">
                        <Input placeholder="用户名称" />
                    </FormItem>

                    <Tooltip content="开发中...">
                        <FormItem>
                            <Button disabled={true} className="w-full" type="primary">
                                Submit
                            </Button>
                        </FormItem>
                    </Tooltip>

                    <FormItem>
                        <Button
                            onClick={() => {
                                setLogout();
                            }}
                            className="w-full"
                            type="primary"
                        >
                            退出登录
                        </Button>
                    </FormItem>
                </Form>
            </Modal>
        </div>
    );
};

export default Modules;
