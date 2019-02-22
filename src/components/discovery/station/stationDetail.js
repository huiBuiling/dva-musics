import React, {Component} from 'react';
import { Button, Tabs, NavBar,Icon,Badge } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import request from "../../../utils/request";

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现 - 主播电台 - 详情
 */
class StationDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radioDetail:{},        //电台详情
        }
    }

    componentDidMount() {
        // this.props.history.push('/discover');
    }

    renderTabBar = (props)=>{
        return (<Sticky>
            {({ style }) => <div style={{ ...style, zIndex: 1, top:45 }}><Tabs.DefaultTabBar {...props} /></div>}
        </Sticky>);
    }


    render() {
        const { radioDetail } = this.props;
        console.log(radioDetail);
        const tabs = [
            { title: '详情' },
            { title: <Badge>节目{radioDetail.programCount}</Badge> },
        ];

        return (
            <div className="m-detail">
                <NavBar
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={() => this.props.history.go(-1)}
                    rightContent={<span onClick={() => {
                        this.props.history.push('playMusic')
                    }}><i className="icon-m-bfz"/></span>}
                >电台</NavBar>

                <div>
                    {/*<img src={radioDetail.dj.backgroundUrl} alt=""/>*/}
                    <div>
                        <p>{radioDetail.dj.nickname}</p>
                        <p>{radioDetail.subCount}人订阅</p>
                    </div>
                    <Button>订阅</Button>
                </div>


                <div className="m-detail-con">
                    <StickyContainer>
                        <Tabs tabs={tabs}
                              initalPage={'t2'}
                              renderTabBar={this.renderTabBar}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '1050px', backgroundColor: '#fff' }}>
                                <h3>主播</h3>
                                <div className='m-detail-con-zb'>
                                    <img src={radioDetail.dj.avatarUrl} alt=""/>
                                    <div>
                                        <p>{radioDetail.dj.nickname}</p>
                                        <p></p>
                                    </div>
                                    <div>
                                        <Button>赞赏</Button>
                                        <span>214次赞赏</span>
                                    </div>
                                </div>
                                <h3>电台内容简介</h3>
                                <div className='m-detail-con-des'>
                                    {radioDetail.desc}
                                </div>
                                <h3>精彩评论</h3>
                                <div className='m-detail-con-comment'>
                                    {
                                        radioDetail.commentDatas.length > 0 && radioDetail.commentDatas.map((item,index) =>{
                                            return <p>{item}</p>
                                        })
                                    }}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '1050px', backgroundColor: '#fff' }}>
                                Content of second tab
                            </div>
                        </Tabs>
                    </StickyContainer>
                </div>
            </div>
        )
    }
}

export default StationDetail;
