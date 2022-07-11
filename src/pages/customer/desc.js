import { Descriptions, Tag } from '@arco-design/web-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertDescription } from 'src/services/store';

const Desc = ({ user }) => {
    const categoryList = useSelector((state: any) => state.container.categoryList);
    const [categories, setCategories] = useState([])
    const data = convertDescription(user)

    useEffect(() => {
        if (!user) {
            return
        }
        const categories = categoryList.filter(category => {
            return user.category_ids && user.category_ids.includes(category.id)
        })
        setCategories(categories)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!user) {
        return <></>
    }

    return <div className="customer-desc-wrapper">
        <Descriptions
            column={3}
            data={data}
            style={{ marginBottom: 5 }}
            labelStyle={{ paddingRight: 36 }}
        />
        <div>
            {categories.map(item => {
                return <Tag key={item.name} className="mr-2" color={"#00b42a"}>{item.name}</Tag>
            })}
        </div>
    </div>
}

export default Desc 