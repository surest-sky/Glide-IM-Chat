import { Menu, Modal, Button } from '@arco-design/web-react';
import { IconEdit, IconPlusCircle } from '@arco-design/web-react/icon';
import { useState } from 'react';

import { ReactComponent as BitSvg } from 'src/static/svg/bit.svg';
import { ReactComponent as ChartSvg } from 'src/static/svg/chart.svg';
import { ReactComponent as ChatSvg } from 'src/static/svg/chat.svg';
import { ReactComponent as DoubtSvg } from 'src/static/svg/doubt.svg';
import { ReactComponent as PoteSvg } from 'src/static/svg/pote.svg';
import { ReactComponent as RobotSvg } from 'src/static/svg/robot.svg';
import { ReactComponent as UsersSvg } from 'src/static/svg/users.svg';
import { ReactComponent as VipSvg } from 'src/static/svg/vip.svg';

const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;

const Menus = () => {
    const [cateVisible, setCateVisible] = useState(false);
    const editCategory = () => {

    }

    return <div>
        <Menu className="menu-container" theme='dark' levelIndent={0} onClickMenuItem={(key, path) => {
            console.log(key, path)
        }}>
            <div className="flex justify-between menu-container-header">
                <div className="flex">
                    <img src="https://teacher.tutorpage.net/static/media/new-logo-circular.33be506198f72cf366b7.png" alt="2" />
                    <span className="font-bold text-white">TutorPage</span>
                </div>
                <div className="operate">
                    <IconEdit className="mr-2 text-white hover:text-gray-300" />
                    <IconPlusCircle className="text-white hover:text-gray-300" />
                </div>
            </div>
            <MenuItem key='workspace'>
                <ChatSvg />
                工作台
            </MenuItem>
            <MenuItemGroup key='2_0' title={<div className="flex items-center justify-start"><span className="mr-2">分类</span> <IconEdit onClick={editCategory} className="text-white hover:text-gray-300" /></div>} className="mb-5">
                <MenuItem key='2_0_0'><VipSvg /> VIP</MenuItem>
                <MenuItem key='2_0_2'><PoteSvg /> 待沟通客户</MenuItem>
                <MenuItem key='2_0_3'><UsersSvg /> 潜在客户</MenuItem>
                <MenuItem key='2_0_4'><BitSvg /> 其他</MenuItem>
            </MenuItemGroup>
            <MenuItemGroup key='3_1' title='工作空间'>
                <MenuItem key='3_0_0'><UsersSvg /> 客户列表</MenuItem>
                <MenuItem key='3_0_2'><ChartSvg /> 市场分析</MenuItem>
                <MenuItem key='3_0_3'><DoubtSvg /> 帮助中心</MenuItem>
                <MenuItem key='3_0_4'><RobotSvg /> 回复机器人</MenuItem>
            </MenuItemGroup>
        </Menu>
        <Modal
            title='分类编辑'
            visible={cateVisible}
            onOk={() => setCateVisible(false)}
            onCancel={() => setCateVisible(false)}
            autoFocus={false}
            focusLock={true}
        >

        </Modal>
    </div>
}

export default Menus