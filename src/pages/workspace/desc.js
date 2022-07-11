import { Typography, Descriptions, Tag, Card } from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react'
import './styles/desc.scss'
const { Title } = Typography;


const Desc = () => {
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const categoryList = useSelector((state: any) => state.container.categoryList);
    const [data, setData] = useState([])
    const [categories, setCategories] = useState([])

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
                    label: "用户名称: ",
                    value: chatWithUser.name
                },
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
                }
            ]
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatWithUser])

    return <div className="desc-container">
        <div className="desc-header-container">
            <Title heading={6}>详细信息</Title>
        </div>

        <div className={`desc-wrapper ${data.length ? '' : 'hidden'}`}>
            <Card bordered={false} className="card-info">
                <Descriptions
                    column={1}
                    title=''
                    data={data}
                    style={{ marginBottom: 5 }}
                    labelStyle={{ paddingRight: 36 }}
                />
                <div>
                    {categories.map(item => {
                        return <Tag key={item.name} className="mr-2" color={"#00b42a"}>{item.name}</Tag>
                    })}
                </div>
            </Card >
        </div>
    </div>
}

export default Desc;