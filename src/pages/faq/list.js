import { Button, Input, Message, Spin, Popconfirm, Typography } from '@arco-design/web-react';
import { IconDelete, IconEdit, IconPlusCircle } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';
import { getArticleList, delArticle } from 'src/api/chat/faq'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import HtmlApp from 'src/components/HtmlApp'

import Breadcrumb from 'src/components/Breadcrumb';
import './styles/faq.scss';

const { Title, Paragraph } = Typography;
const List = (props) => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const originLists = useRef([])
    const _lists = [
        {
            'id': 1,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 2,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 3,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 4,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        }
    ]
    const id = searchParams.get("id")
    const [lists, setLists] = useState([_lists])
    const _article = {
        id: 0,
        title: '',
        publish_at: '',
        content: ``
    }
    const [article, setAritcle] = useState(_article)
    const loadList = async () => {
        setLoading(true)
        const { data: { Data } } = await getArticleList().finally(() => setLoading(false))
        setLists(Data)
        setAritcle((article) => {
            return Data.find(item => item.id === parseInt(id)) || _article
        })
        originLists.current = Data
    }

    const selectArticle = (item) => {
        setAritcle(item)
    }

    useEffect(() => {
        article.id && navigate('/faq/list?id=' + article.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [article])

    useEffect(() => {
        loadList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const DeleteProp = ({ item }) => {
        return <div>
            <Popconfirm
                title='是否继续删除'
                onOk={async () => {
                    console.log('item', item)
                    await delArticle(item.id).then(() => { Message.success("删除成功") })
                    setLists(lists => {
                        return lists.filter(list => list.id !== item.id)
                    })
                    if (item.id === article.id) {
                        setAritcle(_article)
                    }
                }}
                onCancel={() => { }}
            >
                <IconDelete className="delete" />
            </Popconfirm>
        </div>
    }
    return (
        <div className="setting-container">
            <div className="setting-card card-wrapper">
                <Breadcrumb title="帮助中心" />
                <div className="flex faq-wrapper">
                    <Spin className="faq-wrapper-title-list" loading={loading}>
                        <div className="flex">
                            <Input
                                className="mr-2"
                                allowClear
                                placeholder='Please Search'
                                onChange={(value) => {
                                    setLists(lists => {
                                        if (!value) return originLists.current
                                        return originLists.current.filter(list => list.title.indexOf(value) > -1)
                                    })
                                }}
                            />
                            <Button type="primary" onClick={() => {
                                navigate(`/faq/editor`)
                            }}><IconPlusCircle /></Button>
                        </div>
                        <ul className="overflow-y-auto article-list scrollbar">
                            {
                                lists.map(item => {
                                    return <li onClick={() => selectArticle(item)} data-item-id={item.id} className={article.id === item.id ? 'active' : ''}>
                                        {item.title}< DeleteProp item={item} />
                                    </li>
                                })
                            }
                        </ul>
                    </Spin>
                    <div className="faq-wrapper-content">
                        {article.content ?
                            <>
                                <Title heading={4} className="flex faq-wrapper-title">{article.title}  <IconEdit onClick={() => {
                                    navigate(`/faq/editor?id=${article.id}`)
                                }} /></Title>
                                <Paragraph className="faq-wrapper-publist-at">发布时间: {article.publish_at}</Paragraph>
                                <Paragraph className="faq-wrapper-detail scrollbar"><HtmlApp html={article.content}></HtmlApp></Paragraph></>
                            :
                            <Title heading={4} >暂无数据</Title>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}

export default List