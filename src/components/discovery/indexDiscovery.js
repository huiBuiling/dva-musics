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
            showRadioDetail:false,     //电台显示
            radioDetail:{},            //电台详情
        }
    }

    componentDidMount() {
        // simulate img loading
        setTimeout(() => {
            this.setState({
                data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            });
        }, 100);
    }

    getRadioDetail = (id)=>{
        //获取diantai - 详情 rid: 电台的id
        request(`dj/detail?rid=${id}`).then(data =>{
            if(data.data.code === 200){
                console.log(data.data.djRadio);
                this.setState({
                    radioDetail:data.data.djRadio,
                    showRadioDetail:true
                });
                // this.props.history.push('/stationDetail');
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })

    }

    render() {
        const { showRadioDetail,radioDetail } = this.state;
        const tabs = [
            {title: '个性推荐'},
            {title: '主播电台'},
        ];
        return (
            <div className="m-dis">
                {
                    showRadioDetail && <StationDetail radioDetail={radioDetail}/>
                }
                <div style={{display: showRadioDetail ? 'none':'block'}}>
                    {/*top*/}
                    <NavBar
                        mode="light"
                        icon={<i style={{fontSize:23}} className="icon-dis-ly"/>}
                        // onLeftClick={() => console.log('onLeftClick')}
                        rightContent={<span onClick={() => {
                            this.props.history.push('playMusic')
                        }}><i className="icon-m-bfz"/></span>}
                    ><SearchBar placeholder="Search" maxLength={8}/></NavBar>

                    <div className="m-dis-t">
                        <Tabs tabs={tabs}
                              initialPage={1}
                              // onChange={(tab, index) => {}}
                              // onTabClick={(tab, index) => {}}
                        >
                            {/*个性推荐*/}
                            <DiscoveryPersonality />

                            {/*主播电台*/}
                            <DiscoveryAnchorStation getRadioDetail={this.getRadioDetail}/>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default IndexDiscovery;
