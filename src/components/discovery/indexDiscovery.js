import React, {Component} from 'react';
import { NavBar, SearchBar, Tabs,Toast } from 'antd-mobile'
import DiscoveryPersonality from './discoveryPersonality';
import DiscoveryAnchorStation from './discoveryAnchorStation';
import StationDetail from './station/stationDetail';
import request from "../../utils/request";

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现
 */
class IndexDiscovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex:1,                //tab index
            showRadioDetail:false,     //电台显示
            radioDetail:{},            //电台详情
            isSub:false,               //是否订阅电台
        }
    }

    componentDidMount() {}

    getRadioDetail = (id,isSub)=>{
        //获取diantai - 详情 rid: 电台的id
        request(`dj/detail?rid=${id}`).then(res =>{
          console.log(res.data.djRadio);
            if(res.data.code === 200){
                this.setState({
                    radioDetail:res.data.djRadio,
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        });

        //获取节目
        request(`dj/program?rid=${id}&limit=10`).then(res =>{
            if(res.data.code === 200){
                let radioProgram = [];
                let radioProgramId = [];
                res.data.programs.map(item =>{
                    radioProgram.push({
                        name:item.name,
                        listenerCount:item.listenerCount,
                        createTime:item.createTime,
                        duration:item.duration
                    });
                    radioProgramId.push(item.mainSong.id);
                })
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
    }

    //关闭详情
    closeRadioDetail = ()=>{
        this.setState({
            showRadioDetail:false
        });
    }

    render() {
        const { showRadioDetail,radioDetail,radioProgram,radioProgramId,tabIndex,isSub,radioId } = this.state;
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
                              tabIndex === 0 && <DiscoveryPersonality/>
                            }

                            {/*主播电台*/}
                            {
                              tabIndex === 1 &&
                              <DiscoveryAnchorStation
                                  getRadioDetail={this.getRadioDetail}
                              />
                            }
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default IndexDiscovery;
