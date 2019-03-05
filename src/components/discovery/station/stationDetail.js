import React, {Component} from 'react';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import {Button, Tabs, NavBar, Icon, Badge,Toast} from 'antd-mobile';
import request from "../../../utils/request";

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现 - 主播电台 - 详情
 */
@withRouter
class StationDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radioDetail: {},        //电台详情
            tabIndex:1,
            currentIndex:-1,        //当前节目
        }
    }

    componentDidMount() {
        let radioProgramId = this.props.radioProgramId;
        this.getRadioProgramDetail(radioProgramId);
    }

    getRadioProgramDetail = (id)=>{
        //获取全部节目url
        request(`song/url?id=${id}`).then(res =>{
            if(res.data.code === 200){
                this.setState({
                    radioProgramDetail:res.data.data,
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        });
    }

    /**
     * 订阅
     * t : 1 关注 | 0 取消
     */
    subscribe  = ()=>{
        const {isSub,radioId} = this.props;
        const t = isSub ? '0':'1';
        const msg = isSub ? '取消订阅成功':'订阅成功';
        request(`dj/sub?rid=${radioId}&t=${t}`).then(res =>{
            if(res.code === 200){
                this.setState({
                    isSub:!isSub
                });
                Toast.success(msg);
            }
        })
    }

    //获取总时长
    time = (msd)=> {
        let time = parseFloat(msd) / 1000;
        let hour= 0 , second = 0,minute = 0;
        if (time !== null && time !== "") {
            if (time > 60 && time < 60 * 60) {
                minute = parseInt(time / 60.0,10);
                second = parseInt((parseFloat(time / 60.0,10) - parseInt(time / 60.0,10)) * 60,10);
            }
            else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                hour = parseInt(time / 3600.0,10);
                minute = parseInt((parseFloat(time / 3600.0,10) - parseInt(time / 3600.0,10)) * 60,10)
                second = parseInt((parseFloat((parseFloat(time / 3600.0,10) - parseInt(time / 3600.0,10)) * 60,10) - parseInt((parseFloat(time / 3600.0,10) - parseInt(time / 3600.0,10)) * 60,10)) * 60,10);
            }
            else {
                second = parseInt(time,10);
            }
        }
        if (hour < 10 && hour !== 0) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }

        if (hour === 0) {
            time = minute + ":" + second;
        }else{
            time = hour + ":" + minute + ":" + second;
        }
        return time;
    }

    //获取日期
    getTime = (val)=>{
        const date = new Date(val);
        const year = date.getFullYear();
        const month = date.getMonth()+1;
        const day = date.getDate();
        return year+'-'+month+'-'+day;
    }

    //播放及暂停
    getCurrent = (index)=>{
        const { radioProgram, radioDetail, isSub } = this.props;
        let { currentIndex,radioProgramDetail } = this.state;

        const url = radioProgramDetail[index].url;
        const {id, name, imgUrl} = radioProgram[index];

        const station = {
            avatarUrl : radioDetail.dj.avatarUrl,
            nickname: radioDetail.dj.nickname,
            subCount:radioDetail.subCount,
            isSub
        }
        this.props.getCurrent({id, name, imgUrl, url},station,false);

        const audio = document.getElementById('audio');
        audio.src = url;
        if(currentIndex === index){
            audio.pause();
            index = -1;
        }else{
            audio.play();
        }
        this.setState({
            currentIndex:index
        });
    }

    //播放全部
    playAll = ()=>{
        //获取节目全部数据
        const { radioProgram, radioDetail, isSub } = this.props;
        const station = {
            avatarUrl : radioDetail.dj.avatarUrl,
            nickname: radioDetail.dj.nickname,
            subCount:radioDetail.subCount,
            isSub
        }
        // console.log(station);
        radioProgram.map((item,index) =>{
            item.url = this.state.radioProgramDetail[index].url;
        })
        this.props.dispatch({
            type:'playMusic/getPlayMusicList',
            data:radioProgram
        });

        //开始播放
        const cur = radioProgram[0];
        this.props.getCurrent(cur,station,false);
        this.setState({
            currentIndex:0
        });

        this.props.history.push('/playMusic');
    }

    render() {
        const { radioDetail, radioProgram, playMusicCurrent } = this.props;
        let { tabIndex,currentIndex } = this.state;
        const tabs = [
            {title: '详情'},
            {title: <Badge>节目{radioDetail.programCount}</Badge>},
        ];

        radioProgram.filter((item,index) =>{
            if(item.id === playMusicCurrent.id){
                currentIndex = index;
            }
        })

        return (
            <div className="m-detail">
                <div className="m-detail-t" style={{backgroundImage: `url(${radioDetail.dj.backgroundUrl})`}}>
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={this.props.closeRadioDetail}
                        rightContent={<span onClick={() => {
                            this.props.history.push('/playMusic')
                        }}><i className="icon-m-bfz"/></span>}
                    >电台</NavBar>

                    <div className="m-detail-top">
                        <div>
                            <p className="m-detail-top-name">{radioDetail.dj.nickname}</p>
                            <p>{radioDetail.subCount}人订阅</p>
                        </div>
                        <Button onClick={this.subscribe}>
                            {
                                this.props.isSub ? '已订阅':
                                    <span><i className="icon-live" />订阅</span>
                            }
                        </Button>
                    </div>
                </div>


                <div className="m-detail-con">
                    <Tabs tabs={tabs}
                          initialPage={tabIndex}
                          onChange={(tab, index) => {this.setState({tabIndex:index})}}
                    >
                        {/*详情*/}
                        <div className="m-detail-con-tab">
                            <h3>主播</h3>
                                <div className='m-detail-con-zb'>
                                    <img src={radioDetail.dj.avatarUrl} alt=""/>
                                    <div className="m-detail-con-zb-l">
                                        <p>{radioDetail.dj.nickname}</p>
                                        <p>{radioDetail.category}</p>
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
                                            return <div className="m-detail-comment" key={index}>
                                                        <img src={item.userProfile.avatarUrl} alt=""/>

                                                        <div>
                                                            <p className="m-detail-name">{item.userProfile.nickname}</p>
                                                            <p>{item.content}</p>
                                                            <p className="m-detail-from"><span></span>{item.programName}</p>
                                                        </div>
                                                    </div>
                                        })
                                    }
                                </div>
                        </div>

                        {/*节目*/}
                        <div className="m-detail-con-tab m-detail-program">
                            <div className="m-detail-program-top">
                                <span className="m-detail-program-num">共 10 期</span>
                                <span style={{float:'right'}} onClick={this.playAll}><i className="icon-s-all-bg"/> 播放全部</span>
                            </div>
                            {
                                radioProgram.map((item, index) => {
                                    return <div key={index} className="m-detail-program-item">
                                        <p>{index + 1}</p>
                                        <div>
                                            <p>{item.name}</p>
                                            <p>
                                                <span>{this.getTime(item.createTime)}</span>
                                                <span onClick={() => this.getCurrent(index)}>
                                                              <i className={currentIndex === index ? "icon-bf-zt" : "icon-bf-bf"}/>{item.listenerCount}
                                                          </span>
                                                <span><i className="icon-d-time"/>{this.time(item.duration)}</span>
                                            </p>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </Tabs>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, dispatch)=>{
    return {
        playMusicList: state.playMusic.playMusicList,
        playMusicCurrent: state.playMusic.playMusicCurrent
    }
}
export default connect(mapStateToProps)(StationDetail);
