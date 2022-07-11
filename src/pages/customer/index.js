import { Button, Card, Collapse, Form, Input, Popconfirm, Table } from '@arco-design/web-react';
import Breadcrumb from 'src/components/Breadcrumb';
import Desc from './desc'
import './styles/index.scss';

const CollapseItem = Collapse.Item;
const FormItem = Form.Item;
const Rebot = () => {
    const [form] = Form.useForm();
    const data = [
        {
            key: 1,
            name: '卓飞',
            duration: 200,
            sessions: '100',
            at: '2022-12-07 12:00:001 ~ 12-07 13:00:00',
            user: {
                avatar: "",
                category_ids: [5, 13],
                collect: { id: 0, uid: 0, ip: '', region: '', browser: '' },
                id: 86,
                isMe: false,
                lastMessage: { mid: 1610, seq: 0, from: 543750, to: 543784, type: -1073741823 },
                message_count: 0,
                motto: "",
                name: "雷欧",
                opend: 0,
                status: 0,
                uid: 543784,
            }
        },
        {
            key: 2,
            name: '卓飞',
            duration: 200,
            sessions: '100',
            at: '2022-12-07 12:00:001 ~ 12-07 13:00:00',
            user: {
                avatar: "",
                category_ids: [5, 13],
                collect: { id: 0, uid: 0, ip: '', region: '', browser: '' },
                id: 86,
                isMe: false,
                lastMessage: { mid: 1610, seq: 0, from: 543750, to: 543784, type: -1073741823 },
                message_count: 0,
                motto: "",
                name: "雷欧",
                opend: 0,
                status: 0,
                uid: 543784,
            }
        },
        {
            key: 3,
            name: '卓飞',
            duration: 200,
            sessions: '100',
            at: '2022-12-07 12:00:001 ~ 12-07 13:00:00',
            user: {
                avatar: "",
                category_ids: [5, 13],
                collect: { id: 0, uid: 0, ip: '', region: '', browser: '' },
                id: 86,
                isMe: false,
                lastMessage: { mid: 1610, seq: 0, from: 543750, to: 543784, type: -1073741823 },
                message_count: 0,
                motto: "",
                name: "雷欧",
                opend: 0,
                status: 0,
                uid: 543784,
            }
        },
        {
            key: 4,
            name: '卓飞',
            duration: 200,
            sessions: '100',
            at: '2022-12-07 12:00:001 ~ 12-07 13:00:00',
            user: {
                avatar: "",
                category_ids: [5, 13],
                collect: { id: 0, uid: 0, ip: '', region: '', browser: '' },
                id: 86,
                isMe: false,
                lastMessage: { mid: 1610, seq: 0, from: 543750, to: 543784, type: -1073741823 },
                message_count: 0,
                motto: "",
                name: "雷欧",
                opend: 0,
                status: 0,
                uid: 543784,
            }
        },
    ];
    const removeRow = () => { }
    const columns = [
        {
            title: '用户名称',
            dataIndex: 'name',
        },
        {
            title: '沟通时长',
            dataIndex: 'duration',
        },
        {
            title: '会话数',
            dataIndex: 'sessions',
        },
        {
            title: '会话周期',
            dataIndex: 'at',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (col, record) => (
                <Popconfirm
                    title='是否继续删除 ?'
                    onOk={() => removeRow(record.key)}
                >
                    <Button size="small" type='primary' status='danger'>
                        删除
                    </Button>
                </Popconfirm>
            ),
        },

    ];

    return (
        <div className="setting-container">
            <div className="setting-card card-wrapper">
                <Breadcrumb title="客户管理" />
                <Collapse className="mb-5 collapse-search">
                    <CollapseItem header='查询'>
                        <Form form={form} layout={'inline'} >
                            <FormItem>
                                <Input className="border border-gray-400 border-dashed" value="" placeholder="客户昵称查询" />
                            </FormItem>
                            <FormItem>
                                <Input className="border border-gray-400 border-dashed" value="" placeholder="客户地域查询" />
                            </FormItem>
                            <FormItem>
                                <Button type="outline">查询</Button>
                            </FormItem>
                        </Form>

                    </CollapseItem>
                </Collapse>
                <Table expandedRowRender={(record) => {
                    return <Desc user={record.user} />

                }} rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(selectedRowKeys, selectedRows);
                    }
                }} columns={columns} data={data} />
            </div>

        </div>
    );
}

export default Rebot