/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Input, Message, Spin } from '@arco-design/web-react';
import { IconDelete, IconDragArrow } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { getCategoryList, updateCategoryApi, deleteCategoryApi } from 'src/api/chat/setting';
import IconsSelect from 'src/components/Icons/select'
import lodash from 'lodash'
import '../styles/category.scss';

const Category = () => {
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState([])

    const updateAction = useRequest(updateCategoryApi, {
        manual: true,
        onSuccess: (result, params) => {
            Message.success("更新成功 ！");
        },
        onError: (error) => {
            Message.error(error.message);
        },
    })

    const deleteCategory = async (id) => {
        await deleteCategoryApi(id);
        Message.success('删除成功')
        setCategory((cates) => {
            return cates.filter(cate => {
                return cate.id !== id
            })
        })
    }

    const loadData = async () => {
        const { data: { Data } } = await getCategoryList()
        const category = lodash.orderBy(Data, 'weight')
        console.log('category', category)
        setCategory(category)
        setLoading(false)
    }

    const submit = () => {
        category.forEach(item => {
            if (!item.name) {
                Message.error("请不要设置为空");
                throw new Error('请不要设置为空')
            }

            // if (!item.icon) {
            //     Message.error("请设置 Icon");
            //     throw new Error('请设置 Icon')
            // }
        })

        console.log(category)
        updateAction.run({ categories: category })
    }

    const updateCategory = (id, fields) => {
        console.log(fields)
        setCategory((cates) => {
            return cates.map(item => {
                if (item.id === id) {
                    return Object.assign(item, fields)
                }
                return item
            })
        })
    }

    useEffect(() => {
        loadData()
    }, [])

    return <Card
        className="w-full category-container"
        title='分类管理'
        bordered={false}
    >
        {loading ? <Spin /> :
            <>
                {
                    category.map((item) => {
                        return <div key={item.id} className={`flex justify-between mt-1 category-item`}>
                            <Input value={item.name} onChange={(v) => { updateCategory(item.id, { name: v }) }} addAfter={<IconsSelect icon={item.icon} onChange={(v) => updateCategory(item.id, { icon: v })} />} />
                            <div className="category-action"><IconDragArrow className="mr-2" /><IconDelete onClick={() => { deleteCategory(item.id) }} /></div>
                        </div>
                    })
                }
                <Button type="primary" loading={updateAction.loading} onClick={() => submit()} className="mt-5">提交</Button>
            </>
        }
    </Card>
}

export default Category