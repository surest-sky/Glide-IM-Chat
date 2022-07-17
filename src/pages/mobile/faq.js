import { Empty, Input, Breadcrumb, Link, Spin } from '@arco-design/web-react';
import { IconRight } from '@arco-design/web-react/icon';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticleList } from './apis/faq';
import './styles/faq.scss';

const InputSearch = Input.Search;
const BreadcrumbItem = Breadcrumb.Item;
const Faq = (props, ref) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [lists, setLists] = useState([])
    const originLists = useRef(null)

    useEffect(() => {
        setLoading(true)
        getArticleList().then(({ data }) => {
            data.Data && setLists(data.Data)
            originLists.current = data.Data
        }).finally(() => setLoading(false))
    }, [])

    return <div className="mobile-faq-list-container">
        <Breadcrumb className="mt-3 mb-2">
            <BreadcrumbItem>
                <Link onClick={() => {
                    navigate('/m')
                }}>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>文章列表
            </BreadcrumbItem>
        </Breadcrumb>
        <InputSearch
            placeholder='Search'
            style={{ width: 350 }}
            onChange={(value) => {
                setLists(lists => {
                    if (!value) return originLists.current
                    return originLists.current.filter(list => list.title.indexOf(value) > -1)
                })
            }}
        />

        <div className="mt-1 mobile-faq-list">
            {
                !lists.length ? <Empty /> :
                    <Spin loading={loading} className="w-full">
                        {
                            lists.map(item => {
                                return <div key={item.id} className=" mobile-faq-list-item">
                                    <div onClick={() => {
                                        navigate('/m/faq/show?id=' + item.id)
                                    }} className="flex justify-between w-full">
                                        <span>{item.title}</span> <span><IconRight /></span>
                                    </div>
                                </div>
                            })
                        }
                    </Spin>

            }
        </div>
    </div >
}

export default Faq