

import { Tabs, Typography, Card } from '@arco-design/web-react';
import Layout from 'src/components/Layout/layout'
import { IconCalendar, IconClockCircle, IconUser } from '@arco-design/web-react/icon';
import Category from './components/category'
import './styles/setting.scss';
const TabPane = Tabs.TabPane;
const Settings = () => {
    return (
        <Layout>
            <div className="setting-container">
                <div className="setting-card">
                    <Tabs defaultActiveTab='1' tabPosition='left'>
                        <TabPane key='1' title={<><IconCalendar /><span className='ml-1'>分类设置</span></>}>
                            <Category />
                        </TabPane>
                        <TabPane key='2' title={<><IconCalendar /><span className='ml-1'>分类设置</span></>}>
                            <Typography.Paragraph>Content of Tab Panel 2</Typography.Paragraph>
                        </TabPane>
                        <TabPane key='3' title={<><IconCalendar /><span className='ml-1'>系统设置</span></>}>
                            <Typography.Paragraph>Content of Tab Panel 3</Typography.Paragraph>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;