import React, {Component} from 'react';
import { Carousel,Toast } from 'antd-mobile';
import { withRouter } from 'dva/router';
import { api } from '../../utils/api';
import PersonalityDynamic from './discoveryPersonalityDynamic';

/**
 * @author hui
 * @date 2019/2/14
 * @Description: 发现 - 个性推荐
 */
class DiscoveryPersonality extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgHeight: 126,

            recommendList:[],    //每日推荐歌单列表
            radioList:[],        //主播电台列表
            mvList:[],           //mv列表
            musicList:[],        //新音乐列表
        }

        this.dayRecommend = this.dayRecommend.bind(this);
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        //获取轮播banner
        // api.discovery_banner().then(res =>{
        //     if(res.code === 200){
        //         this.setState({
        //             carouselList: res.banners
        //         });
        //     }
        // }).catch(err =>{
        //     Toast.fail('发生错误');
        // })

        //获取每日歌单推荐
        api.personalized_recommend().then(res =>{
            if(res.code === 200){
                this.setState({
                    recommendList: res.recommend.length > 3 ? res.recommend.slice(0,3) : res.recommend
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })

        //获取推荐新音乐
        api.personalized_newsong().then(res =>{
            if(res.code === 200){
                this.setState({
                    musicList: res.result.length > 3 ? res.result.slice(0,3) : res.result
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })

        //获取推荐电台
        api.discovery_recommend().then(res =>{
            if(res.code === 200){
                this.setState({
                    radioList: res.djRadios.length > 3 ? res.djRadios.slice(0,3) : res.djRadios
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })
    }

    //跳转每日推荐
    dayRecommend = ()=>{
        this.props.history.push('/dayRecommend');
    }

    render() {
        const { recommendList, musicList, radioList } = this.state;
        const { carouselList } = this.props;

        return (
            <div className="m-dis-tab m-dis-recommend">
                {/*bg*/}
                <div className="m-dis-carousel"></div>

                {/*轮播*/}
                <Carousel
                    autoplay={false}
                    infinite
                    // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    // afterChange={index => console.log('slide to', index)}
                >
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
                        <div><span><i className="icon-dis-dt"/></span></div>
                        <p><span>私人FM</span></p>
                    </div>
                    <div>
                        <div onClick={this.dayRecommend}><span><i className="icon-dis-mrtj"/></span></div>
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
                <div className="m-dis-re-list">
                    {recommendList.length > 0 && <h3>推荐歌单</h3>}
                    <ul style={{maxHeight:150}}>
                        {recommendList.map((item,index) =>{
                            return <li key={index}>
                                <div>
                                    <img src={item.picUrl} alt=""/>
                                    <span>{item.playcount.toString().substring(0,4)}万</span>
                                </div>
                                <p>{item.name}</p>
                            </li>
                        })}
                    </ul>

                    <h3>推荐新音乐</h3>
                    <ul>
                        {musicList.map((item,index) =>{
                            return <li key={index}>
                                <div>
                                    <img src={item.song.album.picUrl} alt=""/>
                                </div>
                                <p>{item.song.name}</p>
                                <p className="name">{item.song.artists[0].name}</p>
                            </li>
                        })}
                    </ul>

                    {/*<h3>推荐MV ></h3>
                    <ul style={{height: 137,marginBottom: 0}}>
                        {mvList.map((item,index) =>{
                            return <li key={index}>
                                <div>
                                    <img src={item.picUrl} alt=""/>
                                </div>
                                <p>{item.name}</p>
                                <p>{item.artists[0].name} / {item.artists[1].name}</p>
                                <p className="name">{item.artistName}</p>
                            </li>
                        })}
                    </ul>*/}

                    <h3>主播电台</h3>
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

                {/*动态*/}
                <PersonalityDynamic  getCurrent={this.props.getCurrent} />
            </div>
        )
    }
}

export default withRouter(DiscoveryPersonality);
