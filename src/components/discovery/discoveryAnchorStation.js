import React, {Component} from 'react';
import { Carousel,Toast } from 'antd-mobile';
import { withRouter } from 'dva/router';
import request from "../../utils/request";

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现 - 主播电台
 */
@withRouter
class DiscoveryAnchorStation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgHeight: 126,

            carouselList:[],     //banner列表
            radioList:[],        //付费精选电台列表
            showDetail:false,    //电台显示
            // radioDetail:{},   //电台详情
            liveRaio: [],        //已关注的电台
            liveRaioCount: 0,    //已关注的电台数
        }
    }

    componentDidMount() {
        //获取轮播banner
        request('banner').then(res =>{
            if(res.data.code === 200){
                this.setState({
                    carouselList:res.data.banners
                });
            }
        })

        //获取电台 - 付费精选dj/paygift?limit=10&offset=20
        /*request('dj/recommend').then(res =>{
            console.log(res.data.result)
            if(res.data.code === 200){
                this.setState({
                    radioList:res.data.result
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })*/

        //已关注的 dj/sublist
        /*request('dj/sublist').then(res =>{
            if(res.data.code === 200) {
                this.setState({
                    liveRaio: res.data.djRadios,
                    liveRaioCount: res.data.count
                })
            }
        })*/

    }

    render() {
        const { radioList,carouselList } = this.state;

        return (
            <div className="m-dis-tab m-dis-radio">
                <div>
                    {/*bg*/}
                    <div className="m-dis-carousel"></div>

                    {/*轮播*/}
                    <Carousel autoplay={false} infinite>
                        {carouselList.map((item,index) => (
                            <a
                                key={index}
                                style={{
                                    display: 'inline-block',
                                    width: '100%',
                                    height: this.state.imgHeight
                                }}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt=""
                                    style={{width: '100%',height:'100%', verticalAlign: 'top'}}
                                    onLoad={() => {
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({imgHeight: 'auto'});
                                    }}
                                />
                            </a>
                        ))}
                    </Carousel>

                    {/*图标操作*/}
                    <div className="m-dis-icon">
                        <div>
                            <div><span><i className="icon-radio-fl"/></span></div>
                            <p><span>电台分类</span></p>
                        </div>
                        <div>
                            <div><span><i className="icon-dis-phb"/></span></div>
                            <p><span>电台排行</span></p>
                        </div>
                        <div>
                            <div><span><i className="icon-radio-dt"/></span></div>
                            <p><span>DI.FM</span></p>
                        </div>
                        <div>
                            <div><span><i className="icon-radio-xb2"/></span></div>
                            <p><span>关注电台</span></p>
                        </div>
                    </div>

                    {/*列表*/}
                    <div className="m-dis-ra-list">
                        <h3>今日优选</h3>
                        <ul>
                            {radioList.map((item,index) =>{
                                return <li key={index} onClick={()=>this.props.getRadioDetail(item.id)}>
                                            <img src={item.picUrl} alt=""/>
                                            <div>
                                                <p className="title">{item.name}</p>
                                                <p>节目：{item.programCount}</p>
                                                <p>{item.rcmdText}</p>
                                            </div>
                                        </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default DiscoveryAnchorStation;
