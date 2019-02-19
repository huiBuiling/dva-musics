import React, {Component} from 'react';
import { NavBar,Icon,Toast } from 'antd-mobile';
import request from "../../utils/request";

/**
 * @author hui
 * @date 2019/2/18
 * @Description: 朋友圈 - 列表 - 对应某一条详情
 */
class DynamicDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUrl:null,          //当前音乐|视频地址
            isPlay:false,             //是否播放
            urlDetail:null,           //资源获取失败提示
        }
    }

    componentDidMount() {
        const { dyDetailUrl } = this.props;
        if(dyDetailUrl == 0 || dyDetailUrl == 1){
            let msg = dyDetailUrl == 0 ? '歌曲':'视频';
            Toast.fail(`${msg}资源获取失败！！！`);
            this.setState({
                urlDetail:`${msg}资源获取失败！！！`
            });
        }
    }

    /**
     * 评论
     * param(必选参数)
     * t:1 发送 | 0 删除
     * tpye:
       * 0: 歌曲
       * 1: mv
       * 2: 歌单
       * 3: 专辑
       * 4: 电台
       * 5: 视频
     * id:对应资源 id
     * content :要发送的内容
     * comment?t=1&type=1&id=5436712&content=test (往广岛之恋 mv 发送评论: test)
     * comment?t=0&type=1&id=5436712&commentId=1535550516319` (在广岛之恋 mv 删除评论)
     * */
    setComment = (id,followed,type)=>{
      request(`comment?t=${followed}&type=${type}&id=${id}`).then(data => {
        console.log(data.data)
      });
    }

    //播放歌曲
    playAudio = ()=>{
        const { urlDetail, isPlay} = this.state;
        if(urlDetail == null){
            Toast.fail(urlDetail);
        }else{
            const audio = this.refs.audio;
            if(!isPlay){
                audio.play();
            }else{
                audio.pause();
            }
        }
    }

    render() {
        const { dyDetail,dyDetailUrl } = this.props;
        const json = JSON.parse(dyDetail.json);
        let val = json.song && json.song.artists.length === 1 && json.song.artists.length > 0 ? '' : '/';

        return (
            <div className="m-dis-dynamic m-dis-dynamic-d">
                {/*top*/}
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={this.props.showDynamicList}
                >
                    <div>
                        <p>动态</p>
                    </div>
                </NavBar>

                <div className="m-dis-dynamic-item" onClick={this.getUserDynamic}>
                    <img src={dyDetail.user.avatarUrl} alt=""/>
                    <div className="m-dis-dynamic-item-all">
                        <div className="m-dis-dynamic-item-all-title">
                            <span
                                className={dyDetail.user.followed ? "m-dis-dynamic-item-atten m-atten-y" :"m-dis-dynamic-item-atten"}
                                onClick={()=>this.setAtten(dyDetail.user.userId, dyDetail.user.followed)}>
                                {dyDetail.user.followed ? '已关注' : <span><i className="icon-d-yh-add"/>关注</span>}
                            </span>
                            <p>{dyDetail.user.nickname}</p>
                            <p className="msg"><span>{json.video && dyDetail.rcmdInfo !== null ? dyDetail.rcmdInfo.userReason : this.props.getTime(dyDetail.showTime)}</span></p>
                        </div>

                        <p>{json.msg}</p>

                        {/*song 歌曲*/}
                        {json.song &&
                            <div className="m-dis-dynamic-item-all-m">
                                {/*id*/}
                                <audio src={dyDetailUrl} ref='audio' preload="true" />
                                <img src={json.song.album.picUrl} alt=""/>
                                <span className="m-play" onClick={this.playAudio}>
                                    <i className={this.state.isPlay ? "icon-bf-zt":"icon-bf-bf"}/>
                                </span>
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
                                <video id="video" width={`${json.video.width}px`} controls autoPlay preload="none">
                                    <source src={dyDetailUrl} type="video/mp4" />
                                </video>
                            </div>
                        }

                        {/*program 电台*/}
                        {json.program &&
                          <div className="m-dis-dynamic-item-all-m">
                            <img src={json.program.radio.picUrl} />
                            {/*<span className="m-play" onClick={()=>this.getCurrenturl(json.video.videoId)}><i className={currentIndex == index ? "icon-bf-zt":"icon-bf-bf"}/></span>*/}
                            <div>
                              <p>{json.program.radio.desc}</p>
                              <p><span>{json.program.radio.category}</span>{json.program.radio.name}</p>
                            </div>
                          </div>
                        }

                        {/*resource 评论*/}
                        {json.resource &&
                            <div className="m-dis-dynamic-item-all-m m-dis-dynamic-item-pl">
                                <p>
                                    <span className="m-pl"><i className="icon-d-yh-pl-yh" /></span>
                                    <span style={{color:'cornflowerblue'}}>@{dyDetail.user.nickname}：</span>
                                    {json.resource.content}
                                </p>
                                <p className="msg" style={{marginTop:10}}>{json.resource.resourceName}</p>
                            </div>
                        }

                        {/*img*/}
                        <div className={dyDetail.pics.length > 2 ? "m-dis-dynamic-item-all-c2" : "m-dis-dynamic-item-all-c"}>
                            <ul>
                                {dyDetail.pics.map((itemP, indexP) =>{
                                    return <li key={indexP} ><img src={itemP.originUrl} alt="" /></li>
                                })}
                            </ul>
                        </div>

                        <div className='m-dis-dynamic-item-opera'>
                          <span onClick={()=>this.setLike()}><i className="icon-d-yh-zan"/>点赞({dyDetail.info.likedCount})</span>
                          <span className="m-dis-dynamic-item-opera-zf"><i className="icon-d-yh-zf"/>转发({dyDetail.info.shareCount})</span>
                          <span onClick={()=>this.setComment()}><i className="icon-d-yh-pl2"/>评论({dyDetail.info.commentCount})</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DynamicDetail;
