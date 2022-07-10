/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Space, Input, Message, Spin } from '@arco-design/web-react';
import { IconDelete, IconPlus, IconDragArrow } from '@arco-design/web-react/icon';
import { useRequest } from 'ahooks';
import lodash from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { deleteCategoryApi, getCategoryList, updateCategoryApi } from 'src/api/chat/setting';
import IconsSelect from 'src/components/Icons/select';
import '../styles/category.scss';

const Category = () => {
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState([])
    const startRef = useRef(null);

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
        id > 0 && await deleteCategoryApi(id);
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
        setCategory(category)
        setLoading(false)
    }

    const submit = () => {
        category.forEach((item, index) => {
            if (!item.name) {
                Message.error("请输入分类名称");
                throw new Error('请输入分类名称')
            }

            if (!item.icon) {
                Message.error("请设置 分类Icon");
                throw new Error('请设置 分类Icon')
            }
            item.weight = index
        })
        updateAction.run({ categories: category })
    }

    const updateCategory = (id, fields) => {
        setCategory((cates) => {
            return cates.map(item => {
                if (item.id === id) {
                    return Object.assign(item, fields)
                }
                return item
            })
        })
    }

    const changePosition = (dragIndex, hoverIndex) => {
        setCategory(category => {
            const data = [...category];
            let temp = data[dragIndex];
            // 交换位置
            data[dragIndex] = data[hoverIndex];
            data[hoverIndex] = temp;
            console.log(...data)
            return data
        });
    };

    const onDragEnter = (e, hoverIndex) => {
        e.preventDefault();
    };

    const onDragStart = index => {
        startRef.current = index;
    };

    const onDragEnd = (e, index) => {
        e.preventDefault();
        if (startRef.current === index) {
            return;
        }
        changePosition(startRef.current, index);
    };

    const onDragOver = (e, index) => {
        startRef.current = index
        e.preventDefault();
    };

    const addIcon = () => {
        const _category = [...category]
        const emptyItem = category.find(item => item.id === 0)
        if (emptyItem) {
            Message.error("请输入")
            return
        }
        _category.push({
            id: 0,
            name: '',
            placeholder: '请输入'
        })
        setCategory(_category)
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
                    category.map((item, index) => {
                        return <div
                            draggable
                            onDragStart={$event => onDragStart(index)}
                            onDragEnd={$event => onDragEnd($event, index)}
                            onDragEnter={$event => onDragEnter($event, index)}
                            onDragOver={$event => onDragOver($event, index)}
                            key={item.id} className={`flex justify-between mt-1 category-item`}>
                            <Input placeholder={item.placeholder} value={item.name} onChange={(v) => { updateCategory(item.id, { name: v }) }} addAfter={<IconsSelect icon={item.icon} onChange={(v) => updateCategory(item.id, { icon: v })} />} />
                            <div className="category-action">
                                <IconDragArrow onClick={() => changePosition(index)} className="mr-2" />
                                <IconDelete onClick={() => { deleteCategory(item.id) }} />
                            </div>
                        </div>
                    })
                }
                <Space className="mt-5">
                    <Button type="primary" loading={updateAction.loading} onClick={() => submit()}>提交</Button>
                    <Button type="primary" status="success" onClick={() => { addIcon() }} icon={<IconPlus />}></Button>
                </Space>
            </>
        }
    </Card >
}

export default Category