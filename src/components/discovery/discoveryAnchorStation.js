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
            liveRaioList: [],    //已关注的电台
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

        //获取电台推荐
        request('personalized/djprogram').then(res =>{
            if(res.data.code === 200){
                this.setState({
                    radioList:res.data.result
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })
    }

    //已关注的电台
    setMyRadio = ()=>{
        request('dj/sublist').then(res =>{
            if(res.data.code === 200) {
                this.setState({
                    liveRaioList: res.data.djRadios
                })
            }
        })
    }

    render() {
        const { radioList,carouselList,liveRaioList } = this.state;

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

                    {/*图标操作 创作|翻唱：2001*/}
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
                            <p><span>创作|翻唱</span></p>
                        </div>
                        <div>
                            <div onClick={this.setMyRadio}><span><i className="icon-radio-xb2"/></span></div>
                            <p><span>关注电台</span></p>
                        </div>
                    </div>

                    {/*列表*/}
                    {liveRaioList.length > 0 ?
                        <div className="m-dis-ra-list">
                            <h3>我关注的电台</h3>
                            <ul>
                                {liveRaioList.map((item,index) =>{
                                    return <li key={index} onClick={()=>this.props.getRadioDetail(item.id,true)}>
                                        <img src={item.picUrl} alt=""/>
                                        <div>
                                            <p className="title">{item.name}</p>
                                            <p>{item.lastProgramName}</p>
                                            <p>类型：{item.category}</p>
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                        :
                        <div className="m-dis-ra-list">
                            <h3>个性推荐</h3>
                            <ul>
                                {radioList.map((item,index) =>{
                                    return <li key={index} onClick={()=>this.props.getRadioDetail(item.program.radio.id,item.program.subscribed)}>
                                        <img src={item.picUrl} alt=""/>
                                        <div>
                                            <p className="title">{item.name}</p>
                                            <p>节目：{item.program.radio.programCount}</p>
                                            <p>类型：{item.program.radio.category}</p>
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default DiscoveryAnchorStation;
