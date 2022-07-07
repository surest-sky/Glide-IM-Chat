import { Breadcrumb } from '@arco-design/web-react';
import { IconHome } from '@arco-design/web-react/icon';
const BreadcrumbItem = Breadcrumb.Item;

const BreadcrumbC = ({ title }) => {
    return <Breadcrumb style={{ fontSize: 12 }} className="mb-5">
        <BreadcrumbItem>
            <IconHome />
        </BreadcrumbItem>
        <BreadcrumbItem>{title}</BreadcrumbItem>
    </Breadcrumb>
}

export default BreadcrumbC;