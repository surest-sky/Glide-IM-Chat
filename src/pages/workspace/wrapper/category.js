import { Message, Modal, Select } from '@arco-design/web-react';
import {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import { useSelector } from 'react-redux';
import { setCategoryForUser } from 'src/api/chat/chat'


const Category = (props, ref) => {
    const categoryList = useSelector((state: any) => state.container.categoryList);
    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [value, setValue] = useState([])
    const item = useRef([])

    const setItem = (_item) => {
        item.current = _item
        console.log(_item)
        setValue(_item.category_ids)
    }

    const updateCategoryAction = () => {
        console.log(item.current)
        console.log(value)
        setConfirmLoading(true)
        setCategoryForUser(item.current.uid, { category_ids: value }).then(({ data }) => {
            Message.success("设置分类成功")
            setConfirmLoading(false)
            setVisible(false)
            setValue([])
        }).finally(() => setConfirmLoading(false));
    }

    useImperativeHandle(ref, () => ({
        setItem,
        setVisible
    }));

    return <Modal
        unmountOnExit={true}
        title='设置用户分类'
        visible={visible}
        onOk={() => updateCategoryAction()}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        confirmLoading={confirmLoading}
    >
        <Select value={value} onChange={(v) => setValue(v)} mode='multiple' placeholder="请选择用户分类">
            {categoryList.map((option, index) => (
                <Select.Option key={option.id} value={option.id}>
                    {option.name}
                </Select.Option>
            ))}
        </Select>

    </Modal>
}

export default forwardRef(Category)