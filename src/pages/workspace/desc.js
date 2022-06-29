import { Typography, Descriptions, Card } from '@arco-design/web-react';
import './styles/desc.scss'
const { Title } = Typography;

const Desc = () => {
    const data = [
        {
            label: 'Name',
            value: 'Socrates',
        },
        {
            label: 'Mobile',
            value: '123-1234-1234',
        },
        {
            label: 'Residence',
            value: 'Beijing',
        },
        {
            label: 'Hometown',
            value: 'Beijing',
        },
        {
            label: 'Address',
            value: 'Yingdu Building, Zhichun Road, Beijing',
        },
    ];

    return <div className="desc-container">
        <div className="desc-header-container">
            <Title heading={6}>详细信息</Title>
        </div>

        <div className="desc-wrapper">
            <Card bordered={false} className="card-info">
                <Descriptions
                    column={1}
                    title='用户信息'
                    data={data}
                    style={{ marginBottom: 20 }}
                    labelStyle={{ paddingRight: 36 }}
                />
            </Card >
            <Card bordered={false} className="card-info">
                <Descriptions
                    column={1}
                    title='SEO'
                    data={data}
                    labelStyle={{ textAlign: 'right', paddingRight: 36 }}
                />
            </Card>
        </div>
    </div>
}

export default Desc;