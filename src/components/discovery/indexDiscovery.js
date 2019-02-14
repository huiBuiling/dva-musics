import React, {Component} from 'react';
import {NavBar, Icon, SearchBar, Tabs, Carousel} from 'antd-mobile'
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
            imgHeight: 126,

            carouselList:[],     //独家放送列表
            recommendList:[],    //每日推荐歌单列表
            radioList:[],        //主播电台列表
            mvList:[],           //mv列表
            musicList:[],        //新音乐列表
        }
    }

    componentDidMount() {
        // simulate img loading
        setTimeout(() => {
            this.setState({
                data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            });
        }, 100);

        //获取独家放送
        request('personalized/privatecontent').then(data =>{
            if(data.data.code === 200){
                this.setState({
                    carouselList:data.data.result
                });
            }
        })

        //获取每日歌单推荐
        request('recommend/resource').then(data =>{
            if(data.data.code === 200){
                let recommendList = data.data.recommend.length > 3 ? data.data.recommend.slice(0,3) :data.data.recommend;
                this.setState({
                    recommendList
                });
            }
        })

        //获取推荐新音乐 personalized/newsong
        request('personalized/newsong').then(data =>{
            if(data.data.code === 200){
                let musicList = data.data.result.length > 3 ? data.data.result.slice(0,3) :data.data.result
                this.setState({
                    musicList
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

        //获取推荐MV
        request('personalized/mv').then(data =>{
            if(data.data.code === 200){
                let mvList = data.data.result.length > 3 ? data.data.result.slice(0,3) :data.data.result
                this.setState({
                    mvList
                });
            }
        })
    }

    //每日推荐
    dayRecommend = ()=>{
        //获取每日歌曲推荐
        request('recommend/songs').then(data =>{
            if(data.data.code === 200){
                this.setState({
                    recommendList:data.data.recommend
                });
            }
        });

        //跳转每日推荐
        this.props.history.props('/dayRecommend');
    }

    render() {
        const tabs = [
            {title: '个性推荐'},
            {title: '主播电台'},
        ];
        const { carouselList, recommendList, musicList, mvList, radioList } = this.state;

        return (
            <div className="m-dis">
                {/*top*/}
                <NavBar
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={() => console.log('onLeftClick')}
                    rightContent={<span onClick={() => {
                        this.props.history.push('playMusic')
                    }}><i className="icon-m-bfz"/></span>}
                ><SearchBar placeholder="Search" maxLength={8}/></NavBar>

                <div className="m-dis-t">
                    <Tabs tabs={tabs}
                          initialPage={0}
                          onChange={(tab, index) => {
                              console.log('onChange', index, tab);
                          }}
                          onTabClick={(tab, index) => {
                              console.log('onTabClick', index, tab);
                          }}
                    >
                        {/*个性推荐*/}
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
                            <div className="m-dis-re-list">
                                <h3>推荐歌单 ></h3>
                                <ul>
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

                                <h3>推荐新音乐 ></h3>
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

                                <h3>推荐MV ></h3>
                                <ul>
                                    {mvList.map((item,index) =>{
                                        return <li key={index}>
                                            <div>
                                                <img src={item.picUrl} alt=""/>
                                            </div>
                                            <p>{item.name}</p>
                                            {/*<p>{item.artists[0].name} / {item.artists[1].name}</p>*/}
                                            <p className="name">{item.artistName}</p>
                                        </li>
                                    })}
                                </ul>

                                <h3>主播电台 ></h3>
                                <ul>
                                    {radioList.map((item,index) =>{
                                        return <li key={index}>
                                            <div><img src={item.picUrl} alt=""/></div>
                                            <p>{item.name}</p>
                                            <p>{item.rcmdtext}</p>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>

                        {/*主播电台*/}
                        <div className="m-dis-tab m-dis-radio">
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
                            <div className="m-dis-ra-list">

                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default IndexDiscovery;
