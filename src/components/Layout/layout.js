import { Menu } from '@arco-design/web-react';
import { IconApps, IconEdit, IconPlusCircle } from '@arco-design/web-react/icon';
// import ChartSvg from 'src/static/audio.svg'
import { ReactComponent as BitSvg } from 'src/static/svg/bit.svg';
import { ReactComponent as ChartSvg } from 'src/static/svg/chart.svg';
import { ReactComponent as DoubtSvg } from 'src/static/svg/doubt.svg';
import { ReactComponent as PoteSvg } from 'src/static/svg/pote.svg';
import { ReactComponent as RobotSvg } from 'src/static/svg/robot.svg';
import { ReactComponent as UsersSvg } from 'src/static/svg/users.svg';
import { ReactComponent as VipSvg } from 'src/static/svg/vip.svg';
import { ReactComponent as ChatSvg } from 'src/static/svg/chat.svg';

import './styles/layout.scss';
const MenuItemGroup = Menu.ItemGroup;
const MenuItem = Menu.Item;


const Layout = (props) => {
    const space = props.space

    return <div className="flex space-container">
        <Menu className="menu-container" theme='dark' levelIndent={0}>
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
            <MenuItem key='0'>
                <ChatSvg />
                工作台
            </MenuItem>
            <MenuItemGroup key='2_0' title='分类' className="mb-5">
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
        <div className="child-container">
            {props.children}
        </div>
    </div>
}

export default Layout