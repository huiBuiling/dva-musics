import React, {Component} from 'react';
import {NavBar, Icon, SearchBar, Tabs, Carousel} from 'antd-mobile'
import request from "../../utils/request";

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现 - 主播电台
 */
class DiscoveryAnchorStation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgHeight: 126,

            carouselList:[],     //banner列表
            radioList:[],        //主播电台列表
        }
    }

    componentDidMount() {

        //获取轮播banner
        request('banner').then(data =>{
            if(data.data.code === 200){
                this.setState({
                    carouselList:data.data.banners
                });
            }
        })

        //获取推荐电台
        request('dj/recommend').then(data =>{
            if(data.data.code === 200){
                let radioList = data.data.djRadios.length > 3 ? data.data.djRadios.slice(0,3) :data.data.djRadios
                this.setState({
                    radioList
                });
            }
        })
    }

    render() {
        const { carouselList, radioList } = this.state;

        return (
            <div className="m-dis-tab m-dis-radio">
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
                                src={item.picUrl}
                                alt=""
                                style={{width: '100%', verticalAlign: 'top'}}
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
                        <div><span><i className="icon-dis-dt"/></span></div>
                        <p><span>私人FM</span></p>
                    </div>
                    <div>
                        <div><span><i className="icon-dis-mrtj"/></span></div>
                        <p><span>每日推荐</span></p>
                    </div>
                    <div>
                        <div><span><i className="icon-dis-gd"/></span></div>
                        <p><span>歌单</span></p>
                    </div>
                    <div>
                        <div><span><i className="icon-dis-phb"/></span></div>
                        <p><span>排行榜</span></p>
                    </div>
                </div>

                {/*列表*/}
                <div className="m-dis-ra-list m-dis-re-list">
                    <h3>主播电台 ></h3>
                    <ul>
                        {radioList.map((item,index) =>{
                            return <li key={index}>
                                <div><img src={item.picUrl} alt=""/></div>
                                <p>{item.name}</p>
                                <p className="name">{item.rcmdtext}</p>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default DiscoveryAnchorStation;
