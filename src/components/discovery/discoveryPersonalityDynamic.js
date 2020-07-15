import React, {Component} from 'react';
import { Toast } from 'antd-mobile';
import { api } from "../../utils/api";

/**
 * @author hui
 * @date 2019/2/15
 * @Description: 发现 - 个性推荐 - 动态
 */
class PersonalityDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dynaminList:[],           //动态列表
            currentIndex:-1,          //當前歌曲
            // currentUrl:null,          //当前音乐地址
            currentVideoUrl:null,     //当前视频地址
        }
    }

    componentDidMount() {
        //获取动态
        api.dynamic_list().then(res =>{
            if(res.code === 200){
                this.setState({
                    dynaminList: res.event
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        })

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

    //播放|暂停音乐
    playAudio = (index, id, name, imgUrl) => {
        const audio = document.getElementById('audio');
        //开始播放
        if (audio && this.state.currentIndex !== index) {
            audio.volume = 0.5;
            //获取歌曲MP3地址
            api.song_url(id).then(res => {
                if (res.data.code === 200) {
                    this.props.getCurrent({
                        id, name, imgUrl,
                        data:res.data.data[0].url
                    } ,null,true);

                    this.setState({
                        currentIndex: index
                    }, () => {
                        audio.src = res.data.data[0].url;
                        audio.play();
                    });
                }
            }).catch(err => {
                Toast.fail('发生错误');
            });
        } else if (audio && this.state.currentIndex === index) {
            audio.pause();
            this.setState({currentIndex: -1});
        }
    }

    //获取视频MP4地址
    getVideoUrl = (v, id, index)=>{
        const video = document.getElementById(v);

        api.video_url(id).then(res => {
            if (res.code === 200) {
                this.setState({
                    currentVideoUrl: res.urls[0].url,
                    currentIndex:index
                },()=>{
                    video.load();   ////重新加载src指定的资源
                    video.play();
                });
            }
        }).catch(err =>{
            Toast.fail('发生错误');
        });
    }

    render() {
        const { dynaminList,currentIndex,currentVideoUrl } = this.state;
        return (
            <div className="m-dis-dynamic">
                {/*列表*/}
                {
                    dynaminList.slice(0,6).map((item, index) =>{
                        const json = JSON.parse(item.json);
                        let val = json.song && json.song.artists.length === 1 && json.song.artists.length > 0 ? '' : '/';

                        return <div className="m-dis-dynamic-item" key={index}>
                                    <img src={item.user.avatarUrl} alt=""/>
                                    <div className="m-dis-dynamic-item-all">
                                        {
                                            json.video ?
                                                <div className="m-dis-dynamic-item-all-vtitle">
                                                    <p>{item.user.nickname}</p>
                                                </div>
                                                :
                                                <div>
                                                    <p>{item.user.nickname}</p>
                                                    <p className="msg"><span>{item.info.commentThread.resourceTitle}</span></p>
                                                </div>
                                        }
                                        <p>{json.msg}</p>

                                        {/*song*/}
                                        {json.song &&
                                            <div className="m-dis-dynamic-item-all-m">
                                                {/*id*/}
                                                <img src={json.song.album.picUrl} alt=""/>
                                                <span className="m-play" onClick={()=>this.playAudio(index, json.song.id,json.song.name,json.song.album.picUrl)}><i className={currentIndex === index ? "icon-bf-zt":"icon-bf-bf"}/></span>
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

                                        {/*video*/}
                                        {json.video &&
                                            <div className="m-dis-dynamic-item-all-mv">
                                                <video id={`video${index}`} width={`${json.video.width}px`} controls={currentIndex === index ? true:false} preload="none">
                                                    <span>{currentVideoUrl}</span>
                                                    <source src={currentVideoUrl} type="video/mp4" />
                                                </video>
                                                <div className="m-dis-dynamic-item-all-mv-img" style={{width: `${json.video.width}`,display:currentIndex === index ? 'none':'block'}}>
                                                    <img src={json.video.coverUrl} alt="" />
                                                    <span className="m-play" onClick={()=>this.getVideoUrl(`video${index}`,json.video.videoId,index)}><i className={currentIndex === index ? "icon-bf-zt":"icon-bf-bf"}/></span>
                                                </div>
                                            </div>
                                        }

                                        {/*program*/}
                                        {json.program &&
                                          <div className="m-dis-dynamic-item-all-m">
                                            <img src={json.program.radio.picUrl} alt=""/>
                                            {/*<span className="m-play" onClick={()=>this.getCurrenturl(json.video.videoId)}><i className={currentIndex === index ? "icon-bf-zt":"icon-bf-bf"}/></span>*/}
                                            <div>
                                              <p>{json.program.radio.desc}</p>
                                              <p><span>{json.program.radio.category}</span>{json.program.radio.name}</p>
                                            </div>
                                          </div>
                                        }

                                        {/*img*/}
                                        <div className={item.pics.length > 1 ? "m-dis-dynamic-item-all-c2" : "m-dis-dynamic-item-all-c"}>
                                            <ul>
                                                {item.pics.map((itemP, indexP) =>{
                                                    return <li key={indexP} ><img src={itemP.originUrl} alt="" /></li>
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                    })
                }
            </div>
        )
    }
}

export default PersonalityDynamic;
