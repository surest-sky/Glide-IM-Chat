
import Layout from 'src/components/Layout/layout'
import Menu from './menu'
import Room from './room'
import Desc from './desc'
import './styles/workspace.scss';

const WorkSpace = () => {
    return <Layout space="workspace">
        <Menu />
        <Room />
        <Desc />
    </Layout>
}

export default WorkSpace