import Breadcrumb from 'src/components/Breadcrumb'
const Rebot = () => {
    const lists = [
        {
            'id': 1,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 2,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 3,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 4,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        },
        {
            'id': 5,
            'title': "如何使用帮助机器人",
            "created_at": "2022-12-22"
        }
    ]
    return (
        <div className="setting-container">
            <div className="setting-card card-wrapper">
                <Breadcrumb title="帮助中心" />

                <div className="faq-wrapper">
                    <ul className="faq-wrapper-title-list">
                        {
                            lists.map(item => {
                                return <li>{item.title}</li>
                            })
                        }

                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Rebot