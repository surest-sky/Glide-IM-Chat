import { IconHome } from '@arco-design/web-react/icon';
import { Breadcrumb, Link } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
const BreadcrumbItem = Breadcrumb.Item;

const BreadcrumbC = ({ title, options }) => {
    const navigate = useNavigate();
    return <Breadcrumb style={{ fontSize: 12 }} className="mb-5">
        <BreadcrumbItem>
            <IconHome />
        </BreadcrumbItem>
        {
            options && options.map(option => {
                return <BreadcrumbItem><Link onClick={() => { navigate(option.url) }}>{option.title}</Link></BreadcrumbItem>
            })
        }
        <BreadcrumbItem>{title}</BreadcrumbItem>
    </Breadcrumb>
}

export default BreadcrumbC;