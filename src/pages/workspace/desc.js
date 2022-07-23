import { Card, Descriptions, Tag, Typography } from '@arco-design/web-react';
import {
    IconMenuFold,
    IconMenuUnfold,
} from '@arco-design/web-react/icon';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './styles/desc.scss';
const { Title } = Typography;


const Desc = () => {
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const categoryList = useSelector((state: any) => state.container.categoryList);
    const [data, setData] = useState([])
    const [categories, setCategories] = useState([])
    const [collapse, setCollapse] = useState(true);

    useEffect(() => {
        const collect = chatWithUser?.collect
        if (!collect) {
            return
        }
        const categories = categoryList.filter(category => {
            return chatWithUser.category_ids && chatWithUser.category_ids.includes(category.id)
        })
        setCategories(categories)
        setData(() => {
            return [
                {
                    label: "用户IP: ",
                    value: collect.ip
                },
                {
                    label: "用户ID: ",
                    value: chatWithUser.uid
                },
                {
                    label: "用户设备: ",
                    value: collect.device
                },
                {
                    label: "用户来源: ",
                    value: collect.origin
                },
                {
                    label: "用户地域: ",
                    value: collect.region
                },
                {
                    label: "落地页: ",
                    value: collect.referer
                },

            ]
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatWithUser])

    return <div className={`transition-all desc-container ${collapse ? 'open' : 'close'}`}>

        <div className="desc-header-container items-baseline flex items-center ">
            <div className="desc-icon" onClick={() => setCollapse(!collapse)}>{collapse ? <IconMenuUnfold className="text-xl" /> : <IconMenuFold className="text-xl" />}</div>
            <Title heading={6} className="desc-title" style={{ marginBottom: 14 }}>详细信息</Title>
        </div>

        <div className={`desc-wrapper ${data.length ? '' : 'hidden'}`}>
            <Card bordered={false} className="card-info">
                <Descriptions
                    column={1}
                    title='SEO'
                    border
                    data={data}
                    style={{ marginBottom: 5 }}
                    labelStyle={{ paddingRight: 36 }}
                />
                <div>
                    <Title heading={6}>分类</Title>
                    {categories.map(item => {
                        return <Tag key={item.name} className="mr-2" color={"#00b42a"}> {item.name} </Tag>
                    })}
                </div>
            </Card >
        </div>
    </div>
}

export default Desc;