import React, {Component} from 'react';
import { connect } from 'dva';
import { NavBar, SearchBar, Tabs,Toast } from 'antd-mobile'
import DiscoveryPersonality from './discoveryPersonality';
import DiscoveryAnchorStation from './discoveryAnchorStation';
import StationDetail from './station/stationDetail';
import { api } from "../../utils/api";

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现
 */
class IndexDiscovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,               // tab index
            showRadioDetail:false,     // 电台显示
            radioDetail:{},            // 电台详情
            isSub:false,               // 是否订阅电台
            carouselList: [],          // 轮播图
        }
    }

    componentDidMount () {
        //如果从音乐播放列表返回
        if(this.props.playMusicCurrent.station !== null && this.props.playMusicCurrent.station !== undefined){
            const { curRadio } = this.props;
            this.getRadioDetail(curRadio.id, curRadio.flag);
        }

        this.getBanner();
    }
    
    getBanner = () => {
        api.discovery_banner().then(res =>{
            if(res.code === 200){
                this.setState({
                    carouselList: res.banners
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })
    }

    getRadioDetail = (id,isSub)=>{
        //获取diantai - 详情 rid: 电台的id
        api.djprogram_detail(id).then(res =>{
            if(res.code === 200){
                this.setState({
                    radioDetail: res.djRadio,
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        });

        //获取节目
        api.djprogram_program(id).then(res =>{
            if(res.code === 200){
                let radioProgram = [];
                let radioProgramId = [];
                res.programs.forEach(item => {
                    radioProgram.push({
                        id:item.mainSong.id,
                        name:item.name,
                        listenerCount:item.listenerCount,
                        createTime:item.createTime,
                        duration:item.duration,
                        imgUrl:item.coverUrl,
                        likedCount:item.likedCount
                    });
                    radioProgramId.push(item.mainSong.id);
                });
                this.setState({
                    radioProgram,
                    radioProgramId,
                    showRadioDetail:true,
                    isSub,
                    radioId:id
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        });

        this.props.dispatch({
            type:'stations/getCurRadio',
            data:{id,flag:isSub}
        })
    }

    //关闭详情
    closeRadioDetail = ()=>{
        this.setState({
            showRadioDetail:false
        });
    }

    //保存当前歌曲字段(播放才保存）
    getCurrent = (data, station, flag) => {
        let live = false;
        if(flag){
            live = this.props.liveList.filter(itemL =>itemL.id === data.id).length > 0 ? true : false;
        }
        this.props.dispatch({
            type: 'playMusic/getPlayMusicCurrent',
            data: {
                ...data,
                live,
                station,
                isPlay:true
            }
        });
    }

    render() {
        const { showRadioDetail, radioDetail, radioProgram, 
            radioProgramId, tabIndex, isSub, radioId, carouselList } = this.state;
        const tabs = [
            {title: '个性推荐'},
            {title: '主播电台'},
        ];
        return (
            <div className="m-dis">
                {
                    showRadioDetail &&
                    <StationDetail
                        closeRadioDetail={this.closeRadioDetail}
                        radioDetail={radioDetail}
                        radioProgram={radioProgram}
                        radioProgramId={radioProgramId}
                        isSub={isSub}
                        radioId={radioId}
                        getCurrent={this.getCurrent}
                    />
                }
                <div style={{display: showRadioDetail ? 'none':'block',width:'100%',height:'100%'}}>
                    {/*top*/}
                    <NavBar
                        mode="light"
                        icon={<i style={{fontSize:23}} className="icon-dis-ly"/>}
                        rightContent={<span onClick={() => {
                            this.props.history.push('playMusic')
                        }}><i className="icon-m-bfz"/></span>}
                    ><SearchBar placeholder="Search" maxLength={8}/></NavBar>

                    <div className="m-dis-t">
                        <Tabs className="m-dis-t-tabs"
                            tabs={tabs}
                            initialPage={tabIndex}
                            onChange={(tab, index) => {this.setState({tabIndex:index})}}
                        >
                            {/*个性推荐*/}
                            {
                              tabIndex === 0 && carouselList.length > 0 && 
                              <DiscoveryPersonality 
                                  getCurrent={this.getCurrent}
                                  carouselList={carouselList}
                              />
                            }

                            {/*主播电台*/}
                            {
                              tabIndex === 1 && carouselList.length > 0 && 
                              <DiscoveryAnchorStation
                                  getRadioDetail={this.getRadioDetail}
                                  carouselList={carouselList}
                              />
                            }
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, dispatch) => {
    return {
        playMusicList: state.playMusic.playMusicList,
        liveList: state.users.liveList,
        playMusicCurrent: state.playMusic.playMusicCurrent,
        curRadio: state.stations.curRadio
    }
}
export default connect(mapStateToProps)(IndexDiscovery);