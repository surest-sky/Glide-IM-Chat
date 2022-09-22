import { Breadcrumb, Link, Spin, Typography } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HtmlApp from 'src/components/HtmlApp';
import { getArticleShow } from './apis/faq';
import './styles/faq.scss';

const BreadcrumbItem = Breadcrumb.Item;
const Faq = (props, ref) => {
    const [searchParams] = useSearchParams()
    const { Title, Paragraph } = Typography;
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [article, setArticle] = useState({
        title: '',
        publish_at: '',
        content: ''
    })

    useEffect(() => {
        const id = searchParams.get('id')
        setLoading(true)
        getArticleShow(id).then(({ data }) => {
            data.Data && setArticle(data.Data)
        }).finally(() => setLoading(false))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])



    return <div className="mobile-faq-article-container">
        <Breadcrumb className="mt-3 mb-2">
            <BreadcrumbItem>
                <Link onClick={() => {
                    navigate('/m')
                }}>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Link className={'text-base'} onClick={() => {
                    navigate('/m/faq')
                }}>
                    文章列表
                </Link>
            </BreadcrumbItem>
        </Breadcrumb>
        <Title heading={5} className="text-center">{article.title}</Title>
        <Paragraph className="text-center faq-article-publish-at">发布时间: {article.publish_at}</Paragraph>
        {
            loading ? <Spin /> : <Paragraph className="faq-article-content scrollbar"><HtmlApp html={article.content} /></Paragraph>
        }
    </div>
}

export default Faq