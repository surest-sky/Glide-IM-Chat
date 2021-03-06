import { ReactComponent as BitSvg } from 'src/static/svg/bit.svg';
import { ReactComponent as ChartSvg } from 'src/static/svg/chart.svg';
import { ReactComponent as ChatSvg } from 'src/static/svg/chat.svg';
import { ReactComponent as DoubtSvg } from 'src/static/svg/doubt.svg';
import { ReactComponent as PoteSvg } from 'src/static/svg/pote.svg';
import { ReactComponent as RobotSvg } from 'src/static/svg/robot.svg';
import { ReactComponent as SettingSvg } from 'src/static/svg/setting.svg';
import { ReactComponent as UsersSvg } from 'src/static/svg/users.svg';
import { ReactComponent as VipSvg } from 'src/static/svg/vip.svg';
import { ReactComponent as AccountSvg } from 'src/static/svg/account.svg';
import { ReactComponent as CategorySvg } from 'src/static/svg/category.svg';
import { find, get } from 'lodash';


export const svgs = [
    {
        'icon': 'pote',
        'component': <PoteSvg />,
    },
    {
        'icon': 'bit',
        'component': <BitSvg />,
    },
    {
        'icon': 'chart',
        'component': <ChartSvg />,
    },
    {
        'icon': 'chat',
        'component': <ChatSvg />,
    },
    {
        'icon': 'doubt',
        'component': <ChatSvg />,
    },
    {
        'icon': 'pote',
        'component': <DoubtSvg />,
    },
    {
        'icon': 'robot',
        'component': <RobotSvg />,
    },
    {
        'icon': 'user',
        'component': <UsersSvg />,
    },
    {
        'icon': 'vip',
        'component': <VipSvg />,
    },
    {
        'icon': 'setting',
        'component': <SettingSvg />,
    },
    {
        'icon': 'account',
        'component': <AccountSvg />,
    },
    {
        'icon': 'category',
        'component': <CategorySvg />,
    },
]

export const getComponentSvg = (name) => {
    const svg = find(svgs, ['icon', name])
    return get(svg, 'component')
}
