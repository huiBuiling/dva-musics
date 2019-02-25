import React, {Component} from 'react';
import {Button, Tabs, NavBar, Icon, Badge} from 'antd-mobile';
import {StickyContainer, Sticky} from 'react-sticky';
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
            radioDetail: {},        //电台详情
        }
    }

    componentDidMount() {}

    renderTabBar = (props) => {
        return (
            <Sticky>
                {({style}) => <div style={{...style, zIndex: 1}}><Tabs.DefaultTabBar {...props} /></div>}
            </Sticky>
        );
    }


    render() {
        const {radioDetail} = this.props;
        console.log(radioDetail);
        const tabs = [
            {title: '详情'},
            {title: <Badge>节目{radioDetail.programCount}</Badge>},
        ];

        return (
            <div className="m-detail">
                <div className="m-detail-t" style={{backgroundImage: `url(${radioDetail.dj.backgroundUrl})`}}>
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={this.props.closeRadioDetail}
                        rightContent={<span onClick={() => {
                            this.props.history.push('playMusic')
                        }}><i className="icon-m-bfz"/></span>}
                    >电台</NavBar>

                    <div className="m-detail-top">
                        <div>
                            <p className="m-detail-top-name">{radioDetail.dj.nickname}</p>
                            <p>{radioDetail.subCount}人订阅</p>
                        </div>
                        <Button><i className="icon-live" />订阅</Button>
                    </div>
                </div>


                <div className="m-detail-con">
                    <StickyContainer>
                            <Tabs tabs={tabs}
                                  initalPage={'t2'}
                                  renderTabBar={this.renderTabBar}
                            >
                                <div className="m-detail-con-tab">
                                    <h3>主播</h3>
                                        <div className='m-detail-con-zb'>
                                            <img src={radioDetail.dj.avatarUrl} alt=""/>
                                            <div className="m-detail-con-zb-l">
                                                <p>{radioDetail.dj.nickname}</p>
                                                <p></p>
                                            </div>
                                            <div className="m-detail-con-zb-r">
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
                                            }
                                        </div>
                                </div>
                                <div className="m-detail-con-tab">
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
