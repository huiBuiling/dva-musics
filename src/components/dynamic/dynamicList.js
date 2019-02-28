import React, {Component} from 'react';
import { Toast } from 'antd-mobile';
import {connect} from 'dva';
import request from "../../utils/request";
import DynamicDetail from './dynamicDetail';

/**
 * @author hui
 * @date 2019/2/18
 * @Description: 朋友圈 - 列表
 */
class DynamicList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dynaminList:[],           //动态列表
            currentIndex:-1,          //當前歌曲
            // currentUrl:null,          //当前音乐地址
            currentVideoUrl:null,     //当前视频地址
            showDetail:false,         //显示对应详情
            dyDetailUrl:null,         //详情地址
            follows:[],               //用户关注列表
        }
    }

    componentDidMount() {
        this.getAllDynamic();
        this.getUserAtten(this.props.userId);

        const audio = document.getElementById('audio');
        audio.addEventListener('ended', this.isEnd, false);
    }

    componentWillUnmount(){
        //移除 audio 的事件监听
        const audio = document.getElementById('audio');
        audio.removeEventListener('ended', this.isEnd, false);

        this.setState = (state,callback)=>{
            return;
        };
    }

    //判断歌曲是否播放完畢
    isEnd = () => {
        console.log('播放完毕');
        this.setState({
            currentIndex: -1
        });
    }

    //获取用户详情
    getUserDetail = ()=>{
        request('user/detail?uid=108952364').then(data =>{
            if(data.data.code === 200){
                // console.log(data.data);
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })
    }

    //获取用户关注列表
    getUserAtten = (userId)=>{
        request(`user/follows?uid=${userId}`).then(data =>{
            if(data.data.code === 200){
                this.setState({
                    follows:data.data.follow
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })
    }

    //获取对应用户动态
    getUserDynamic = (id)=>{
        Toast.loading('Loading...', 30, () => {
            console.log('Load complete !!!');
        });
        request(`user/event?uid=${id}`).then(data =>{
            if(data.data.code === 200){
                this.setState({
                    dynaminList:data.data.events
                });
                Toast.hide();
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })
    }

    //获取全部动态
    getAllDynamic = ()=>{
        Toast.loading('Loading...', 30, () => {
            console.log('Load complete !!!');
        });
        request('event').then(data =>{
            if(data.data.code === 200){
                this.setState({
                    dynaminList:data.data.event
                });
                Toast.hide();
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })
    }

    //播放|暂停音乐
    playAudio = (index, id, name, imgUrl) => {
        debugger
        const audio = document.getElementById('audio');
        //开始播放
        if (audio && this.state.currentIndex !== index) {
            audio.volume = 0.5;

            //获取歌曲MP3地址
            request(`song/url?id=${id}`).then(data => {
                if (data.data.code === 200) {
                    this.props.getCurrent(id, name, imgUrl, data.data.data[0].url);
                    this.setState({
                        currentIndex: index
                    }, () => {
                        audio.src = data.data.data[0].url;
                        audio.play();
                    });
                }
            }).catch(err => {
                Toast.fail('歌曲资源获取失败！！！')
            });
        } else if (audio && this.state.currentIndex === index) {
            audio.pause();
            this.setState({currentIndex: -1});
        }
    }

    //获取视频MP4地址
    getVideoUrl = (v, id, index)=>{
        const video = document.getElementById(v);
        request(`video/url?id=${id}`).then(data => {
            if (data.data.code === 200) {
                this.setState({
                    currentVideoUrl:data.data.urls[0].url,
                    currentIndex:index
                },()=>{
                    video.load();   //重新加载src指定的资源
                    video.play();
                });
            }
        }).catch(err => {
            Toast.fail('视频资源获取失败！！！')
        });;
    }

    //时间转换
    getTime = (val)=>{
        const date = new Date(val);
        const year = date.getFullYear();
        const month = date.getMonth()+1;
        const day = date.getDate();
        const h = date.getHours();
        const m = date.getMinutes();
        return year+'-'+month+'-'+day + ' ' + h + ':' + m;
    }

    //关注
    setAtten = (id, followed) => {
        const follow = followed ? 2 : 1;
        request(`follow?id=${id}&t=${follow}`).then(data => {
            /*if (data.data.code === 201) {
              alert('已添加关注');
            }
            if (data.data.code === 200) {
              alert('已添加关注');
            }*/
            if (!followed) {
                alert('已添加关注');
            } else {
                alert('已取消关注');
            }
        }).catch(err => {
            Toast.fail('发生错误');
        });
    }

    /**
     * 点赞
     * 1: mv
     * 4: 电台
     * 5: 视频
     * */
    setLike = (id,followed,type)=>{
        request(`resource/like?t=${followed}&type=${type}&id=${id}`).then(data => {
          // console.log(data.data)
        }).catch(err =>{
            Toast.fail('发生错误');
        });
    }

    /**
     * 转发
     * */
    setShare = ()=>{}

    //跳转详情
    getDynamicDetail = (id, item, type)=>{
        const audio = document.getElementById('audio');
        let { currentIndex } = this.state;

        let urls = type === 1 ? `song/url?id=${id}` : `video/url?id=${id}`;
        if((type === 1 || type === 2) && id !== null){
            request(urls).then(data => {
                if (data.data.code === 200) {
                    if(type === 1){
                        audio.src = data.data.data[0].url;
                    }else{
                        audio.pause();
                        console.log('此时应暂停');
                        currentIndex = -1;
                    }
                    this.setState({
                        dyDetailUrl:data.data.urls[0].url,
                        dyDetail:item,
                        showDetail:true,
                        currentIndex
                    });
                }
            }).catch(err => {
                if(type !== 1){
                    audio.pause();
                    console.log('此时应暂停');
                    currentIndex = -1;
                }
                this.setState({
                    dyDetailUrl:type === 1 ? 0 : 1,
                    dyDetail:item,
                    showDetail:true,
                    currentIndex
                });
            });
        }else{
            this.setState({
                dyDetail:item,
                showDetail:true
            });
        }
    }

    //返回
    showDynamicList = ()=>{
        this.setState({
            showDetail:false
        });
    }

    render() {
        const { dynaminList,follows,
            currentIndex,currentVideoUrl,
            showDetail,dyDetail,dyDetailUrl } = this.state;

        return (
            <div className="m-dis-dynamic" style={{height: 'calc(100% - 45px)', overflowY: 'auto'}}>
                {showDetail &&
                    <div>
                        <DynamicDetail
                            dyDetail={dyDetail}
                            getTime={this.getTime}
                            showDynamicList={this.showDynamicList}
                            dyDetailUrl={dyDetailUrl}
                            getCurrent={this.props.getCurrent}
                        />
                    </div>
                }

                {/*列表*/}
                <div style={{display:showDetail ? 'none':'block'}}>
                    <div className="m-dis-dynamic-follows">
                        <h4>已关注的用户：</h4>
                        <div onClick={this.getAllDynamic}>
                            <span className="m-dis-all"><i className="icon-d-yh-qb" /></span>
                            <p>全部</p>
                        </div>
                        <div onClick={()=>this.getUserDynamic(this.props.userId)}>
                            <img src="http://p1.music.126.net/OyqiZAP0Vchg-GSihjdg6g==/2946691180779246.jpg" alt=""/>
                            <p>慧慧</p>
                        </div>
                        {
                            follows.map((item,index) =>{
                                return <div key={index} onClick={()=>this.getUserDynamic(item.userId)}>
                                            <img src={item.avatarUrl} alt=""/>
                                            <p>{item.nickname}</p>
                                        </div>
                            })
                        }
                    </div>

                    {
                        dynaminList.map((item, index) => {
                            const json = JSON.parse(item.json);
                            let val = json.song && json.song.artists.length === 1 && json.song.artists.length > 0 ? '' : '/';
                            let type = 0;
                            let id = null;
                            if (json.video) {
                                type = 2;
                                id = json.video.videoId;
                            }else if(json.song){
                                type = 1;
                                id = json.song.id;
                            }
                            return <div className="m-dis-dynamic-item" key={index}>
                                        <img src={item.user.avatarUrl} alt=""/>
                                        <div className="m-dis-dynamic-item-all">
                                            <div className="m-dis-dynamic-item-all-title">
                                                    <span
                                                        className={item.user.followed ? "m-dis-dynamic-item-atten m-atten-y" : "m-dis-dynamic-item-atten"}
                                                        onClick={() => this.setAtten(item.user.userId, item.user.followed)}>
                                                        {item.user.followed ? '已关注' :
                                                            <span><i className="icon-d-yh-add"/>关注</span>}
                                                    </span>
                                                <p>{item.user.nickname}</p>
                                                <p className="msg">
                                                    <span>{json.video && item.rcmdInfo !== null ? item.rcmdInfo.userReason : this.getTime(item.showTime)}</span>
                                                </p>
                                            </div>

                                            <p onClick={()=>this.getDynamicDetail(id, item, type)}>{json.msg}</p>

                                            {/*song 歌曲*/}
                                            {json.song &&
                                            <div className="m-dis-dynamic-item-all-m" onClick={() => this.playAudio(index, json.song.id, json.song.name, json.song.album.picUrl)}>
                                                {/*id*/}
                                                <img src={json.song.album.picUrl} alt=""/>
                                                <span className="m-play"><i className={currentIndex === index ? "icon-bf-zt" : "icon-bf-bf"}/></span>
                                                <div>
                                                    <p>{json.song.name}</p>
                                                    <p>
                                                        {json.song.artists.map((itemA, indexA) => {
                                                            return <span
                                                                key={indexA}>{indexA === 0 ? '' : val}{itemA.name}</span>
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            }

                                            {/*video 视频*/}
                                            {json.video &&
                                            <div className="m-dis-dynamic-item-all-mv">
                                                <video id={`video${index}`} width={`${json.video.width}px`}
                                                       controls={currentIndex === index ? true : false} preload="none">
                                                    <source src={currentVideoUrl} type="video/mp4"/>
                                                </video>
                                                <div className="m-dis-dynamic-item-all-mv-img" style={{
                                                    width: `${json.video.width}`,
                                                    display: currentIndex === index ? 'none' : 'block'
                                                }}>
                                                    <img src={json.video.coverUrl} alt=""/>
                                                    <span className="m-play"
                                                          onClick={() => this.getVideoUrl(`video${index}`, json.video.videoId, index)}><i
                                                        className={currentIndex === index ? "icon-bf-zt" : "icon-bf-bf"}/></span>
                                                </div>
                                            </div>
                                            }

                                            {/*program 电台*/}
                                            {json.program &&
                                            <div className="m-dis-dynamic-item-all-m">
                                                <img src={json.program.radio.picUrl} alt=""/>
                                                {/*<span className="m-play" onClick={()=>this.getCurrenturl(json.video.videoId)}><i className={currentIndex == index ? "icon-bf-zt":"icon-bf-bf"}/></span>*/}
                                                <div>
                                                    <p>{json.program.radio.desc}</p>
                                                    <p><span>{json.program.radio.category}</span>{json.program.radio.name}
                                                    </p>
                                                </div>
                                            </div>
                                            }

                                            {/*resource 评论*/}
                                            {json.resource &&
                                            <div className="m-dis-dynamic-item-all-m m-dis-dynamic-item-pl">
                                                <p>
                                                    <span className="m-pl"><i className="icon-d-yh-pl-yh"/></span>
                                                    <span style={{color: 'cornflowerblue'}}>@{item.user.nickname}：</span>
                                                    {json.resource.content}
                                                </p>
                                                <p className="msg" style={{marginTop: 10}}>{json.resource.resourceName}</p>
                                            </div>
                                            }

                                            {/*img*/}
                                            <div
                                                className={item.pics.length > 2 ? "m-dis-dynamic-item-all-c2" : "m-dis-dynamic-item-all-c"}>
                                                <ul>
                                                    {item.pics.map((itemP, indexP) => {
                                                        return <li key={indexP}><img src={itemP.originUrl} alt=""/></li>
                                                    })}
                                                </ul>
                                            </div>

                                            <div className='m-dis-dynamic-item-opera'>
                                                <span onClick={() => this.setLike()}><i
                                                    className="icon-d-yh-zan"/>点赞({item.info.likedCount})</span>
                                                <span className="m-dis-dynamic-item-opera-zf"><i
                                                    className="icon-d-yh-zf"/>转发({item.info.shareCount})</span>
                                                <span onClick={()=>this.getDynamicDetail(id, item, type)}><i
                                                    className="icon-d-yh-pl2"/>评论({item.info.commentCount})</span>
                                            </div>
                                        </div>
                                    </div>
                        })
                    }
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        userId:state.users.userMsg.id
    }
}
export default connect(mapStateToProps)(DynamicList);

